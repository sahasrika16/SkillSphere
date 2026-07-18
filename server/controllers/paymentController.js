const Payment = require('../models/Payment');
const Gig = require('../models/Gig');
const { createNotification } = require("./notificationController");
const generateTxnId = async () => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0,10).replace(/-/g, '');
  const count = await Payment.countDocuments({
    createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
  });
  const seq = String(count + 1).padStart(3, '0');
  return `TXN_${dateStr}_${seq}`;
};

exports.completePayment = async (req, res) => {
  try {
    const { gigId, amount, receiverId } = req.body;

    const payerId = req.user._id;

    const gig = await Gig.findById(gigId);

    if (!gig)
      return res.status(404).json({ message: "Gig not found" });

    if (gig.isPaid)
      return res.status(400).json({ message: "Gig already paid" });

    const transactionId = await generateTxnId();

    const payment = await Payment.create({
      transactionId,
      gigId,
      amount,
      payer: payerId,
      receiver: receiverId,
      status: "Success",
    });

    gig.isPaid = true;
    gig.paymentId = payment._id;
    gig.paidAt = new Date();

    await gig.save();

    // ==========================
    // CLIENT NOTIFICATION
    // ==========================

    await createNotification({
      recipient: payerId,
      sender: payerId,
      type: "payment",
      title: "Payment Successful 💳",
      message: `Your payment of ₹${amount} for "${gig.title}" was successful.`,
      link: `/payments`,
    });

    // ==========================
    // FREELANCER NOTIFICATION
    // ==========================

    await createNotification({
      recipient: receiverId,
      sender: payerId,
      type: "payment",
      title: "Payment Received 🎉",
      message: `You received ₹${amount} for "${gig.title}".`,
      link: `/payments`,
    });

    res.status(201).json({
      message: "Payment successful",
      payment,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Payment failed",
      error: err.message,
    });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({
      $or: [{ payer: userId }, { receiver: userId }]
    }).populate('gigId payer receiver').sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history', error: err.message });
  }
};
const express = require('express');
const router = express.Router();
const { completePayment, getPaymentHistory } = require('../controllers/paymentController');

const { protect } = require("../middleware/authMiddleware");

router.post(
  "/complete",
  protect,
  completePayment
);
router.get('/history/:userId', protect, getPaymentHistory);

module.exports = router;
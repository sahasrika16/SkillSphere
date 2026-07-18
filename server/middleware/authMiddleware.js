const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User no longer exists"
      });
    }

    if (req.user.status === "blocked") {
      return res.status(403).json({
        message: "Account blocked"
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token invalid"
    });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("================================");
    console.log("Logged in user:", req.user.name);
    console.log("User role:", req.user.role);
    console.log("Allowed roles:", roles);
    console.log("================================");

    const userRole = req.user.role?.toLowerCase();

    const allowedRoles = roles.map((role) =>
      role.toLowerCase()
    );

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied for this role"
      });
    }

    next();
  };
};
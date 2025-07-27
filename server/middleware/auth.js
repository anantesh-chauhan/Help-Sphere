const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    // console.log("Access Token from cookies:", accessToken);
    console.log("Middleware called : ----->");

    if (!accessToken) {
      return res.status(401).json({ success: false, message: "No access token provided" });
    }

    // Await the decoded token
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    req.email = decoded.email;

    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user; // store whole user object for convenience
    console.log("User ID from middleware:", user._id);
    console.log("Middleware call completed : ----->");

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = auth;

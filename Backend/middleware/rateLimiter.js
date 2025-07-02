const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message: "Too many login attempts. Please wait a moment and try again.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,  // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    console.warn(`Rate limit hit for IP: ${req.ip}`);
    res.status(429).json({ message: "Too many login attempts. Try again shortly." });
  }
});

module.exports = { loginLimiter };

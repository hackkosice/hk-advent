const rateLimit = require("express-rate-limit");

const submissionLimiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 1 // limit each IP to 1 request per 10 seconds
  });

module.exports = { submissionLimiter };
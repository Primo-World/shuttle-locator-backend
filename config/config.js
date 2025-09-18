require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  googleMapsKey: process.env.GOOGLE_MAPS_API_KEY,
  corsOrigins: [
    "http://localhost:3000", // local dev
    "https://your-portfolio-site.com", // your deployed frontend
  ],
};

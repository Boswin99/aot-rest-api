const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const authRoutes = require("./routes/auth.routes");
const programRoutes = require("./routes/program.routes");
const tourRoutes = require("./routes/tour.routes");
const ipgRoutes = require("./routes/ipg.routes");

const notFoundHandler = require("./middleware/notFoundHandler");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();


const corsOptions = {
  origin: '*', // Allow all origins
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Auth routes
app.use("/api/v1/auth", authRoutes);

// Program routes
app.use("/api/v1/programs", programRoutes);

// Tour routes
app.use("/api/v1/tours", tourRoutes);

// APG routes
app.use("/api/v1/ipg", ipgRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

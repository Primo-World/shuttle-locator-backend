const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const config = require("./config/config");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const shuttleRoutes = require("./routes/shuttle");
const rideRoutes = require("./routes/ride");
const courierRoutes = require("./routes/courier");
const locationRoutes = require("./routes/location");

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: config.corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Attach io instance to app
app.set("io", io);

// Connect DB
connectDB(config.mongoURI);

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Attach Socket.IO to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/shuttles", shuttleRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/couriers", courierRoutes);
app.use("/api/locations", locationRoutes);

// Root
app.get("/", (req, res) =>
  res.send("🚀 Shuttle backend running with Socket.IO")
);

// Endpoint to fetch Google Maps API key (optional, if frontend needs it)
app.get("/api/config/google-maps", (req, res) => {
  res.json({ apiKey: config.googleMapsKey });
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Shuttle updates
  socket.on("updateShuttleLocation", (data) => {
    console.log("📍 Shuttle update received:", data);
    io.emit("shuttleLocationUpdated", data); // Emit to all clients
  });

  // Ride updates
  socket.on("updateRideLocation", (data) => {
    console.log("🚗 Ride update received:", data);
    io.emit("rideLocationUpdated", data);
  });

  // Courier updates
  socket.on("updateCourierLocation", (data) => {
    console.log("📦 Courier update received:", data);
    io.emit("courierLocationUpdated", data);
  });

  socket.on("disconnect", () =>
    console.log("🔴 User disconnected:", socket.id)
  );
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// Server listen
server.listen(config.port, () =>
  console.log(`✅ Server running with Socket.IO on port ${config.port}`)
);

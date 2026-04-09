const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
const inMemoryRequests = [];
const allowedOrigins = FRONTEND_URL.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const { hostname, protocol } = new URL(origin);
    const isLocalHttpOrigin = protocol === "http:" && (hostname === "localhost" || hostname === "127.0.0.1");

    return process.env.NODE_ENV !== "production" && isLocalHttpOrigin;
  } catch {
    return false;
  }
}

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
  })
);
app.use(express.json());

const contactRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const ContactRequest = mongoose.model("ContactRequest", contactRequestSchema);

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

async function loadRequests() {
  if (isDatabaseConnected()) {
    return ContactRequest.find().sort({ createdAt: -1 }).lean();
  }

  return [...inMemoryRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function saveRequest(data) {
  if (isDatabaseConnected()) {
    return ContactRequest.create(data);
  }

  const request = {
    _id: new mongoose.Types.ObjectId().toString(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  inMemoryRequests.unshift(request);
  return request;
}

// MongoDB connection
if (!process.env.MONGO_URI) {
  console.warn("Missing MONGO_URI in backend/.env. Using in-memory request storage.");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.error("MongoDB connection failed:", err.message);
      console.warn("Continuing with in-memory request storage until the database is reachable.");
    });
}

function requireAdmin(req, res, next) {
  if (!ADMIN_API_KEY) {
    return next();
  }

  if (req.headers["x-admin-key"] !== ADMIN_API_KEY) {
    return res.status(401).json({ message: "Unauthorized admin request." });
  }

  return next();
}

// Test route
app.get("/", (req, res) => {
  res.json({ message: "VYAPO API running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: isDatabaseConnected() ? "connected" : "offline",
    storage: isDatabaseConnected() ? "mongodb" : "memory",
  });
});

app.get("/api/requests", requireAdmin, async (req, res) => {
  try {
    const requests = await loadRequests();

    return res.json({
      count: requests.length,
      storage: isDatabaseConnected() ? "mongodb" : "memory",
      requests,
    });
  } catch (error) {
    console.error("Unable to fetch requests:", error);
    return res.status(500).json({ message: "Unable to fetch contact requests." });
  }
});

app.post("/api/requests", async (req, res) => {
  try {
    const { name, phone, email, location, message } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({ message: "Name, phone, email, and message are required." });
    }

    const request = await saveRequest({
      name,
      phone,
      email,
      location,
      message,
    });

    return res.status(201).json({
      message: "Request submitted successfully.",
      requestId: request._id,
      storage: isDatabaseConnected() ? "mongodb" : "memory",
    });
  } catch (error) {
    console.error("Request submission failed:", error);
    return res.status(500).json({ message: "Unable to submit request right now." });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

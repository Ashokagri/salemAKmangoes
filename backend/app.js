import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from "url";

// Load environment variables immediately
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

import product from "./routes/productRoutes.js";
import user from "./routes/userRoutes.js";
import order from "./routes/orderRoutes.js";
import payment from "./routes/paymentRoutes.js";
import errorHandleMiddleware from "./middleware/error.js";

const app = express();

// Required for secure cookies on Render/Heroku/Vercel
app.set("trust proxy", 1);

// Middleware
const rawFrontEndUrl = process.env.FRONTEND_URL || "http://localhost:5173";
// Remove trailing slash if present to prevent CORS mismatch
const frontEndUrl = rawFrontEndUrl.replace(/\/$/, "");

console.log(`Configured CORS for origin: ${frontEndUrl}`);

const corsOptions = {
  origin: frontEndUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", origin: frontEndUrl });
});

// Routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(errorHandleMiddleware);

export default app;
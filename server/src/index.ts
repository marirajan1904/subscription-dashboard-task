import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/error";
import authRoutes from "./routes/auth.route";
import planRoutes from "./routes/plan.route";
import subscriptionRoutes from "./routes/subscription.route";
import adminRoutes from "./routes/admin.route";
import { config } from "./config";

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:5173", // local dev
    "https://subscription-dashboard-task.vercel.app" // deployed frontend
  ],
  credentials: true, // allow cookies
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscribe", subscriptionRoutes);
app.use("/api/my-subscription", (_req, res) => res.redirect(307, "/api/subscribe/me"));
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
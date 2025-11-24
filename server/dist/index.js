"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = require("./middleware/error");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const plan_route_1 = __importDefault(require("./routes/plan.route"));
const subscription_route_1 = __importDefault(require("./routes/subscription.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173", // local dev
        "https://subscription-dashboard-task-2.onrender.com" // deployed frontend
    ],
    credentials: true, // allow cookies
}));
app.options("*", (0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", auth_route_1.default);
app.use("/api/plans", plan_route_1.default);
app.use("/api/subscribe", subscription_route_1.default);
app.use("/api/my-subscription", (_req, res) => res.redirect(307, "/api/subscribe/me"));
app.use("/api/admin", admin_route_1.default);
app.use(error_1.errorHandler);
app.listen(config_1.config.port, () => {
    console.log(`Server running on http://localhost:${config_1.config.port}`);
});

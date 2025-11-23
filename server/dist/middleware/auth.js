"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
        return res.status(401).json({ message: "Unauthorized" });
    const token = header.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.config.accessSecret);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
function requireRole(role) {
    return (req, res, next) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        if (user.role !== role)
            return res.status(403).json({ message: "Forbidden" });
        next();
    };
}

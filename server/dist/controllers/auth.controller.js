"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refreshToken = refreshToken;
exports.logout = logout;
exports.me = me;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const tokens_1 = require("../utils/tokens");
const config_1 = require("../config");
const prisma = new client_1.PrismaClient();
async function register(req, res) {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
        return res.status(409).json({ message: "Email already registered" });
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, password: hashed, role: "USER" },
    });
    res.status(201).json({ message: "Registered successfully", user: { id: user.id, name: user.name, email: user.email } });
}
async function login(req, res) {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcryptjs_1.default.compare(password, user.password);
    if (!ok)
        return res.status(401).json({ message: "Invalid credentials" });
    const payload = { sub: user.id, role: user.role, email: user.email };
    const accessToken = (0, tokens_1.signAccessToken)(payload);
    const refreshToken = (0, tokens_1.signRefreshToken)(payload);
    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: config_1.config.isProd,
        sameSite: "lax",
        domain: config_1.config.cookieDomain,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
        accessToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role.toLowerCase() },
    });
}
async function refreshToken(req, res) {
    const token = req.cookies?.refresh_token;
    if (!token)
        return res.status(401).json({ message: "Missing refresh token" });
    try {
        const payload = (0, tokens_1.verifyRefresh)(token);
        const accessToken = (0, tokens_1.signAccessToken)(payload);
        res.json({ accessToken });
    }
    catch {
        res.status(401).json({ message: "Invalid refresh token" });
    }
}
async function logout(req, res) {
    res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: config_1.config.isProd,
        sameSite: "lax",
        domain: config_1.config.cookieDomain,
        path: "/",
    });
    res.json({ message: "Logged out" });
}
async function me(req, res) {
    const userToken = req.user;
    const user = await prisma.user.findUnique({ where: { id: userToken.sub } });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role.toLowerCase() } });
}

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, verifyRefresh } from "../utils/tokens";
import { config } from "../config";

const prisma = new PrismaClient();

// REGISTER
export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: "USER" },
  });

  res.status(201).json({
    message: "Registered successfully",
    user: { id: user.id, name: user.name, email: user.email },
  });
}

// LOGIN
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const payload = { sub: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Set refresh token as httpOnly cookie
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: config.isProd && process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: config.isProd ? config.cookieDomain : undefined,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    accessToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role.toLowerCase() },
  });
}

// REFRESH TOKEN
export async function refreshToken(req: Request, res: Response) {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(401).json({ message: "Missing refresh token" });

  try {
    const payload = verifyRefresh(token);
    const accessToken = signAccessToken(payload);
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
}

// LOGOUT
export async function logout(req: Request, res: Response) {
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: config.isProd && process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: config.isProd ? config.cookieDomain : undefined,
    path: "/",
  });
  res.json({ message: "Logged out" });
}

// GET CURRENT USER
export async function me(req: Request, res: Response) {
  const userToken = (req as any).user;
  if (!userToken) return res.status(401).json({ message: "Unauthorized" });

  const user = await prisma.user.findUnique({ where: { id: userToken.sub } });
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role.toLowerCase() } });
}

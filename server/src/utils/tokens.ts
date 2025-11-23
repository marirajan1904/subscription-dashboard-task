import jwt from "jsonwebtoken";
import { config } from "../config";

export type JwtPayload = { 
  sub: string; 
  role: "USER" | "ADMIN"; 
  email: string; 
};

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, config.accessSecret, {
    expiresIn: config.accessExpires as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, config.refreshSecret, {
    expiresIn: config.refreshExpires as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccess(token: string) {
  return jwt.verify(token, config.accessSecret) as JwtPayload;
}

export function verifyRefresh(token: string) {
  return jwt.verify(token, config.refreshSecret) as JwtPayload;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
exports.config = {
    port: parseInt(process.env.PORT || "4000", 10),
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpires: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    refreshExpires: process.env.REFRESH_TOKEN_EXPIRES || "7d",
    cookieDomain: process.env.COOKIE_DOMAIN || "localhost",
    isProd: process.env.NODE_ENV === "production",
};

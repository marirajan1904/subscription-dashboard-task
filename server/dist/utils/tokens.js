"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccess = verifyAccess;
exports.verifyRefresh = verifyRefresh;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, config_1.config.accessSecret, {
        expiresIn: config_1.config.accessExpires,
    });
}
function signRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, config_1.config.refreshSecret, {
        expiresIn: config_1.config.refreshExpires,
    });
}
function verifyAccess(token) {
    return jsonwebtoken_1.default.verify(token, config_1.config.accessSecret);
}
function verifyRefresh(token) {
    return jsonwebtoken_1.default.verify(token, config_1.config.refreshSecret);
}

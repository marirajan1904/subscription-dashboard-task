"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../logger");
function errorHandler(err, req, res, next) {
    logger_1.logger.error(err);
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
}

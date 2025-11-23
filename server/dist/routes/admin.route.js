"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
router.get("/subscriptions", auth_1.requireAuth, (0, auth_1.requireRole)("ADMIN"), admin_controller_1.listAllSubscriptions);
exports.default = router;

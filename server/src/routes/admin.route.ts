import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { listAllSubscriptions } from "../controllers/admin.controller";

const router = Router();

router.get("/subscriptions", requireAuth, requireRole("ADMIN"), listAllSubscriptions);

export default router;
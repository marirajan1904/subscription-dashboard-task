import { Router } from "express";
import { subscribe, mySubscription } from "../controllers/subscription.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../utils/validate";
import { subscribeSchema } from "../schemas/subscription.schema";

const router = Router();

router.post("/:planId", requireAuth, validate(subscribeSchema), subscribe);
router.get("/me", requireAuth, mySubscription);

export default router;
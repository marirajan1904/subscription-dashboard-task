import { Router } from "express";
import { register, login, refreshToken, logout, me } from "../controllers/auth.controller";
import { validate } from "../utils/validate";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
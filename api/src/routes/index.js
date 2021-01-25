import { Router } from "express";
const router = Router();
import apiRoutes from "./api";
import webhookRoutes from "./webhook";

// Backend API routes
// /api
router.use("/api", apiRoutes);

// /webhook
router.use("/webhook", webhookRoutes);

export default router;

import { Router } from "express";
const router = Router();
import userRoutes from "./user";
import artistRoutes from "./artist";
import adminRoutes from "./admin";

router.use("/user", userRoutes);
router.use("/artist", artistRoutes);
router.use("/admin", adminRoutes);

export default router;

import { Router } from "express";
const router = Router();
import artistProfile from "./profile";
import artistSubmissions from "./submissions";
import artistCommissions from "./commissions";

router.use(artistProfile);
router.use(artistSubmissions);
router.use(artistCommissions);

export default router;

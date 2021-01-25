import { Router } from "express";
const router = Router();
import adminSubmissions from "./submissions";
import adminEmail from "./email";
import adminCommissions from "./commissions"
import adminOrder from "./orders";
import artistsProfiles from "./artists-profiles";
import adminSettings from "./settings-routes";

router.use(adminEmail);
router.use(adminSubmissions);
router.use(adminCommissions);
router.use(adminOrder);
router.use(artistsProfiles);
router.use(adminSettings);

export default router;

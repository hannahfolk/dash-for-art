import { Router } from "express";
const router = Router();
import userAccount from "./account";

router.use(userAccount);

export default router;

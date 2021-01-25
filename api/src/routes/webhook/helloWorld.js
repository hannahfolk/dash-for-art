import { Router } from "express";
const router = Router();

// /webhook/hello-world
router.post("/", (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

export default router;

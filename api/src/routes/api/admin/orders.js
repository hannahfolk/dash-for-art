import express from "express";
import processOrders from "../../../libs/processOrdersFromShopify";
import { cleanDate, startAndEndTime } from "../../../utils/cleanData";

const router = express.Router();

// TODO: end time does nothing currently
// /api/admin/order-pull?inputDate=2020-05-21&end=14
router.get("/order-pull", async (req, res, next) => {
  const { inputDate, end } = req.query;

  const now = inputDate ? new Date(inputDate) : new Date();
  const { startDate, startHour, endDate, endHour } = startAndEndTime(now);

  const output = `${startDate} ${startHour} ${endDate} ${endHour}`;
  try {
    await processOrders({ startDate, startHour, endDate, endHour });
    res.status(200).send(`CRON SUCCESS: -- ${output}`);
  } catch (error) {
    console.log(`CRON ERROR: -- ${output} :`, error);
    next(error);
  }
});

export default router;

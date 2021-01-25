import express from "express";
import passport from "passport";
import pool from "../../../database/connection";

/**
 * Database queries return an array. Even if 1 item exist.
 * @typedef {{
 *   dbRowId:Number,
 *   order:String,
 *   order_created_at:String,
 *   product_title:String,
 *   vendor:String,
 *   product_type:String,
 *   commissions_amount:Number,
 *   is_commissions_paid:Boolean,
 * }} CommissionsDetails
 *
 */

const router = express.Router();

router.get(
  "/commissions",
  passport.authenticate("jwt"),
  async (req, res, next) => {
    const { artistName } = req.user;

    if (!artistName) {
      return res.status(404).json({ message: "Artist Not Found" });
    }

    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `id` as `dbRowId`, `order_created_at`, `order`, `product_title`, " +
        "`vendor`, `product_type`, `commissions_amount`, `is_commissions_paid` " +
        "FROM `orders` WHERE `vendor`=? " +
        "ORDER BY `order_created_at` DESC ";

      /**
       * @return {CommissionsDetails[]}
       */
      const commissionsDetailsArr = await pool.query(queryString, [artistName]);
      conn.end();

      res.status(200).json({ commissionsDetailsArr });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.post(
  "/commissions/dates",
  passport.authenticate("jwt"),
  async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const { artistName } = req.user;
    let conn;

    if (!artistName) {
      return res.status(405).json({ message: "Artist Not Found" });
    }

    try {
      conn = await pool.getConnection();
      let queryString =
        "SELECT `id` as `dbRowId`, `order_created_at`, `order`, `product_title`, " +
        "`vendor`, `product_type`, `commissions_amount`, `is_commissions_paid` " +
        "FROM `orders` WHERE `vendor`=? ";

      if (startDate && endDate) {
        queryString +=
          "AND `order_created_at` BETWEEN '" +
          startDate +
          " 00:00:00' AND '" +
          endDate +
          " 23:59:59' ";
      }

      queryString += "ORDER BY `order_created_at` DESC ";

      /**
       * @return {CommissionsDetails[]}
       */
      const commissionsDetailsArr = await pool.query(queryString, [artistName]);
      conn.end();

      res.status(200).json({ commissionsDetailsArr });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

export default router;

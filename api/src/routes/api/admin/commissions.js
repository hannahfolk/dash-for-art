import express from "express";
import passport from "passport";
import pool from "../../../database/connection";
import { cleanDate } from "../../../utils/cleanData";

/**
 * Database queries return an array. Even if 1 item exist.
 * @typedef {{
 *   dbRowId:Number,
 *   order:String,
 *   order_created_at:String,
 *   product_title:String,
 *   variant_sku:String,
 *   artist:String,
 *   product_type:String,
 *   is_commissions_paid:Boolean,
 *   is_international:Boolean,
 *   paypal_email:String
 * }} CommissionsDetails
 *
 * @typedef {{
 *  artist:String,
 *  product:String,
 *  productType:String,
 *  quantity:Number,
 *  paidAmount:Number,
 *  unpaidAmount:Number
 * }} CommissionsDetailsByArtist
 *
 * @typedef {{
 *  product:String,
 *  productType:String,
 *  quantity:Number,
 *  paidAmount:Number,
 *  unpaidAmount:Number
 * }} CommissionsDetailsBySpecificArtist
 *
 * @typedef {{
 *  artist:String,
 *  product:String,
 *  quantity:Number,
 *  paidAmount:Number,
 *  unpaidAmount:Number
 * }} CommissionsDetailsByProduct
 *
 *  @typedef {{
 *  artist:String,
 *  productType:String,
 *  quantity:Number,
 *  paidAmount:Number,
 *  unpaidAmount:Number
 * }} CommissionsDetailsByProductType
 *
 * @typedef {{
 *   id: Number,
 *   commissions_payout: String,
 *   product_type: String
 * }} CommissionsPayouts
 *
 */

const router = express.Router();

/* ------------ COMMISSIONS SUMMARY ---------------- */
router.post(
  "/commissions",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { startDate, endDate } = req.body;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `orders`.`id` AS `dbRowId`, `orders`.`order`, `orders`.`order_created_at`, `orders`.`product_title`, " +
        "`orders`.`variant_sku`, `orders`.`vendor` AS `artist`, `orders`.`quantity`, `orders`.`product_type`, " +
        "`orders`.`commissions_amount`, `orders`.`is_commissions_paid`, `orders`.`tags`, " +
        "`artist_profile`.`paypal_email`, `artist_profile`.`is_international`, `payouts`.`group` " +
        "FROM `orders` LEFT JOIN `artist_profile` ON `orders`.`vendor` = `artist_profile`.`artist_name` " +
        "LEFT JOIN `payouts` ON `orders`.`product_type` = `payouts`.`product_type` " +
        "WHERE `order_created_at` BETWEEN '" +
        startDate +
        " 00:00:00' AND '" +
        endDate +
        " 23:59:59' " +
        "ORDER BY `order_created_at` DESC ";

      /**
       * @return {CommissionsDetails[]}
       */
      const commissionsDetailsArr = await pool.query(queryString);

      conn.end();

      res.status(200).json({ commissionsDetailsArr });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.post(
  "/commissions/by-artist/:artistName",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { artistName } = req.params;
    const { startDate, endDate } = req.body;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `product`, `productType`, SUM(`quantity`) AS `quantity`, SUM(`paidAmount`) AS `paidAmount`, SUM(`unpaidAmount`) AS `unpaidAmount` " +
        "FROM (SELECT `product_title` AS `product`, `product_type` AS `productType`, " +
        "COUNT(`product_type`) AS `quantity`, " +
        "IF(`is_commissions_paid`, `commissions_amount` * SUM(`quantity`), 0.00) AS `paidAmount`, " +
        "IF(NOT `is_commissions_paid`, `commissions_amount` * SUM(`quantity`), 0.00) AS `unpaidAmount` " +
        "FROM `orders` " +
        "WHERE `order_created_at` " +
        "BETWEEN '" +
        new Date(startDate).toLocaleDateString("en-CA", { timeZone: "UTC" }) +
        " 00:00:00' AND '" +
        new Date(endDate).toLocaleDateString("en-CA", { timeZone: "UTC" }) +
        " 23:59:59' AND `vendor` = ? " +
        "GROUP BY `vendor`, `product_title`, `product_type`, `commissions_amount`, `is_commissions_paid`) AS subTable " +
        "GROUP BY `product`, `productType`";

      /**
       * @return {CommissionsDetailsBySpecificArtist[]}
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

router.put(
  "/commissions/update",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { dbRowIds, isPaid } = req.body;
    let ids = "`id`=" + dbRowIds.shift();

    if (dbRowIds.length > 0) {
      ids += dbRowIds
        .map((id) => {
          return " OR `id`=" + id;
        })
        .join("");
    }

    let conn;
    try {
      conn = await pool.getConnection();
      const queryUpdate =
        "UPDATE `orders` SET `is_commissions_paid`=? WHERE (" + ids + ");";

      const { affectedRows } = await pool.query(queryUpdate, [isPaid]);
      conn.end();

      res.status(200).json({ affectedRows });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

/* --------- PAYOUTS SECTION ------------- */
router.get(
  "/commissions/payouts",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString = "SELECT * FROM payouts";

      /**
       * @return {CommissionsPayouts[]}
       */
      const commissionsPayouts = await pool.query(queryString);
      conn.end();

      res.status(200).json({ commissionsPayouts });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.post(
  "/commissions/payout",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { rowData } = req.body;
    const { product_type, commissions_payout } = rowData;
    let { group } = rowData;

    if (group === undefined) {
      group = "";
    }

    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "INSERT INTO `payouts` (`product_type`, `commissions_payout`, `group`) VALUES (?,?,?)";
      const queryValue = [product_type, commissions_payout, group];

      /**
       * @return {CommissionsDetails}
       */
      const result = await pool.query(queryString, queryValue);
      conn.end();

      rowData.id = result.insertId;

      res.status(200).json({ tableRowData: rowData });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.put(
  "/commissions/payout",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { rowData } = req.body;
    const { id, product_type, commissions_payout } = rowData;
    let { group } = rowData;

    if (group === undefined) {
      group = "";
    }

    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "UPDATE `payouts` SET `product_type`=?, `commissions_payout`=?, `group`=? WHERE `id`=?";
      const queryValue = [product_type, commissions_payout, group, id];

      const { affectedRows } = await pool.query(queryString, queryValue);
      conn.end();

      res.status(200).json({ tableRowData: rowData });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.delete(
  "/commissions/payout",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { rowData } = req.body;
    const { id } = rowData;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString = "DELETE FROM `payouts` WHERE `id`=?";

      const result = await pool.query(queryString, [id]);
      conn.end();

      res.status(200).json({ tableRowData: rowData });
    } catch (error) {
      console.log(error);
      conn.end();
      next(error);
    }
  }
);

export default router;

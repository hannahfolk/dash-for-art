import express from "express";
import passport from "passport";
import pool from "../../../database/connection";

const router = express.Router();

router.get(
  "/settings/tags",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString = "SELECT * FROM `tags`";
      const tagsArr = await pool.query(queryString);
      conn.end();
      res.status(200).json({ tagsArr });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.post(
  "/settings/tags",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { tag } = req.body;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString = "INSERT INTO `tags` (`tag`) VALUES (?)";
      const result = await pool.query(queryString, [tag]);
      conn.end();
      res.status(200).json({ result });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.delete(
  "/settings/tags/:id",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { id } = req.params;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString = "DELETE FROM `tags` WHERE id = ?";
      const result = await pool.query(queryString, [id]);
      conn.end();
      res.status(200).json({ result });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.get(
  "/settings/email-templates",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `id`, `template_label` AS `templateLabel`, `email_subject` AS `emailSubject`, `email_body` AS `emailBody`, `template_color` AS `templateColor`, `is_preview_img` AS `isPreviewImg` FROM `email_templates`";
      const emailTemplatesArr = await pool.query(queryString);
      conn.end();
      res.status(200).json({ emailTemplatesArr });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.get(
  "/settings/email-templates/:id",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { id } = req.params;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `id`, `template_label` AS `templateLabel`, `email_subject` AS `emailSubject`, `email_body` AS `emailBody`, `template_color` AS `templateColor`, `is_preview_img` AS `isPreviewImg` FROM `email_templates` WHERE id = ?";
      const [emailTemplate] = await pool.query(queryString, [id]);

      conn.end();
      res.status(200).json({ emailTemplate });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.get(
  "/settings/email-templates/get-template-color/:label",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { label } = req.params;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `template_color` AS `templateColor` FROM `email_templates` WHERE `template_label` = ?";
      let [templateColor] = await pool.query(queryString, [label]);

      conn.end();

      if (!templateColor) {
        templateColor = { templateColor: "#6a6a6a" };
        res.status(200).json({ templateColor });
      } else {
        res.status(200).json({ templateColor });
      }
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.post(
  "/settings/email-templates",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const {
      templateLabel,
      emailSubject,
      emailBody,
      templateColor,
      isPreviewImg,
    } = req.body;
    let conn;
    console.log(emailBody.length);

    try {
      conn = await pool.getConnection();
      const queryString =
        "INSERT INTO `email_templates` (`template_label`, `email_subject`, `email_body`, `template_color`, `is_preview_img`) VALUES (?, ?, ?, ?, ?)";
      const result = await pool.query(queryString, [
        templateLabel,
        emailSubject,
        emailBody,
        templateColor,
        isPreviewImg,
      ]);
      conn.end();
      res.status(200).json({ result });
    } catch (error) {
      console.log(error);
      conn.end();
      next(error);
    }
  }
);

router.put(
  "/settings/email-templates/:id",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { id } = req.params;
    const {
      templateLabel,
      emailSubject,
      emailBody,
      templateColor,
      isPreviewImg,
    } = req.body;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "UPDATE `email_templates` SET `template_label` = ?, `email_subject` = ?, `email_body` = ?, `template_color` = ?, `is_preview_img` = ? WHERE id = ?";
      const result = await pool.query(queryString, [
        templateLabel,
        emailSubject,
        emailBody,
        templateColor,
        isPreviewImg,
        id,
      ]);
      conn.end();
      res.status(200).json({ result });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.delete(
  "/settings/email-templates/:id",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { id } = req.params;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString = "DELETE FROM `email_templates` WHERE id = ?";
      const result = await pool.query(queryString, [id]);
      conn.end();
      res.status(200).json({ result });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

export default router;

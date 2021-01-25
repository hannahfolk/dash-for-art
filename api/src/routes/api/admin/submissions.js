import fs from "fs";
import path from "path";
import express from "express";
import multer from "multer";
import { cleanFileName } from "../../../utils/cleanData";
import { cleanStringShopify } from "../../../utils/cleanData";
import passport from "passport";
import pool from "../../../database/connection";

/**
 * Database queries return an array. Even if 1 item exists.
 * @typedef {{
 *   artFile:String,
 *   artistName:String,
 *   artistEmail:String,
 *   title:String,
 *   description:String,
 *   status:String,
 *   previewArt:String,
 *   emailStatus:String,
 *   logs:String,
 * }} SubmissionDetails
 *
 * @typedef {{
 *   artFile:String,
 *   artistName:String,
 *   firstName:String,
 *   lastName:String,
 *   artistEmail:String,
 *   title:String,
 *   description:String,
 *   status:String,
 *   emailStatus:String,
 *   previewArt:String,
 * }} SubmissionDetailsEdit
 *
 */

const router = express.Router();
const FILE_DIRECTORY = "../../art-submissions";
const upload = multer({
  dest: FILE_DIRECTORY,
});

// Multer upload
const cpUpload = upload.fields([
  { name: "artFile", maxCount: 1 },
  { name: "previewArt", maxCount: 1 },
]);

router.get(
  "/submissions/:status",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;
    const { status } = req.params;

    try {
      conn = await pool.getConnection();
      let queryString =
        "SELECT `id`, `artist_name` AS `artistName`, `username_contact_email` AS `artistEmail`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`email_status` AS `emailStatus`, `email_color` AS `emailColor`, `logs`, " +
        "`created_at` AS `createdAt` FROM `submissions` ";

      if (status) {
        queryString += "WHERE `status`='" + status + "' ";
      }

      queryString += "ORDER BY `created_at` DESC ";

      /**
       * @return {SubmissionDetails[]}
       */
      const submissionsDetailsArr = await pool.query(queryString);
      conn.end();

      res.status(200).json({ submissionsDetailsArr });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.post(
  "/submissions/declined-by-date",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;
    const { start, end } = req.body;

    try {
      conn = await pool.getConnection();
      let queryString =
        "SELECT `id`, `artist_name` AS `artistName`, `username_contact_email` AS `artistEmail`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`email_status` AS `emailStatus`, `email_color` AS `emailColor`, `logs`, " +
        "`created_at` AS `createdAt` FROM `submissions` " +
        "WHERE `status`= 'DECLINED' " +
        "AND `created_at` BETWEEN '" +
        start +
        " 00:00:00' AND '" +
        end +
        " 23:59:59' " +
        "ORDER BY `created_at` DESC";

      /**
       * @return {SubmissionDetails[]}
       */
      const submissionsDetailsArr = await pool.query(queryString);
      conn.end();

      res.status(200).json({ submissionsDetailsArr });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.get(
  "/submissions/review/:id",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { id: submissionId } = req.params;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `submissions`.`id`, `submissions`.`username_contact_email` AS `artistEmail`, " +
        "`artist_profile`.`first_name` AS `firstName`, `artist_profile`.`last_name` AS `lastName`, " +
        "`submissions`.`artist_name` AS `artistName`, `submissions`.`title`, `description`, " +
        "`submissions`.`art_file` AS `artFile`, `submissions`.`preview_art` AS `previewArt`, `submissions`.`status`, " +
        "`submissions`.`email_content` AS `emailContent`, " +
        "`submissions`.`email_status` AS `emailStatus`, " +
        "`submissions`.`email_color` AS `emailColor`, " +
        "`submissions`.`created_at` AS `createdAt` " +
        "FROM `submissions` INNER JOIN `artist_profile` " +
        "ON `submissions`.`username_contact_email`=`artist_profile`.`username_contact_email` " +
        "WHERE `submissions`.`id`=?";

      /**
       * @return {SubmissionDetailsEdit}
       */
      const [submissionDetails] = await pool.query(queryString, [submissionId]);

      conn.end();

      res.status(200).json({ submissionDetails });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

router.get(
  "/submissions/logs/:id",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { id } = req.params;
    let conn;
    try {
      conn = await pool.getConnection();
      const queryString = "SELECT logs FROM `submissions` WHERE `id` = ?";
      const [data] = await pool.query(queryString, [id]);
      const { logs } = data;
      conn.end();
      res.status(200).json(logs);
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

// Update Title/Description/Submission Status
router.put(
  "/submissions",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { title, description, status, logs, id } = req.body;
    let conn;

    try {
      conn = await pool.getConnection();
      const queryString =
        "UPDATE `submissions` " +
        "SET `title` = ?, `description` = ?, `status` = ?, `logs` = ? " +
        "WHERE `id` = ?";

      const { affectedRows } = await pool.query(queryString, [
        title,
        description,
        status,
        logs,
        id,
      ]);

      conn.end();

      res.sendStatus(202);
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

// Change Submissions status to DECLINED on mass delete click
router.put(
  "/submissions/status-to-declined",
  passport.authenticate("jwt-admin"),
  (req, res, next) => {
    const { selectedSubmissionsArr } = req.body;
    let conn;

    try {
      selectedSubmissionsArr.forEach(async (submission) => {
        conn = await pool.getConnection();
        const { id } = submission;
        const queryString =
          "UPDATE `submissions` SET `status` = 'DECLINED' WHERE `id` = ?";

        const { affectedRows } = await pool.query(queryString, [id]);

        conn.end();
      });
      res.sendStatus(202);
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

// Delete declined submissions' art file
router.delete(
  "/submissions/declined-all-art-files",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;

    try {
      conn = await pool.getConnection();

      const querySelect =
        "SELECT `id`, `art_file` FROM `submissions` " +
        "WHERE `status` = 'DECLINED' AND `art_file` != ''";

      const allDecSubArr = await pool.query(querySelect);

      for (let i = 0; i < allDecSubArr.length; i++) {
        const { id, art_file } = allDecSubArr[i];
        if (art_file) {
          // Delete Art File
          try {
            const artDiskLocation = path.join(
              __dirname,
              art_file.replace("/api/", "../../../../../")
            );
            fs.unlinkSync(artDiskLocation);
            console.log("Successfully deleted art file!")
            //console.log({ artDiskLocation });
          } catch (error) {
            console.log("Art file Not Found");
          }

          // Update Database
          const queryUpdate =
            "UPDATE `submissions` SET `art_file` = ? WHERE `id` = ?";
          const { affectedRows } = await pool.query(queryUpdate, ["", id]);
          // console.log({ affectedRows });
        }
      }

      conn.end();
      res.sendStatus(202);
    } catch (error) {
      console.log(error);
      conn.end();
      next(error);
    }
  }
);

// Delete declined submissions' art file by id
router.delete(
  "/submissions/declined-art-file/:id",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { id } = req.params;
    let conn;

    try {
      conn = await pool.getConnection();

      const querySelect =
        "SELECT `art_file` FROM `submissions` " +
        "WHERE `id` = ? AND `art_file` != ''";

      const allDecSubArr = await pool.query(querySelect, [id]);

      for (let i = 0; i < allDecSubArr.length; i++) {
        const { art_file } = allDecSubArr[i];
        if (art_file) {
          // Delete Art File
          try {
            const artDiskLocation = path.join(
              __dirname,
              art_file.replace("/api/", "../../../../../")
            );
            fs.unlinkSync(artDiskLocation);
            console.log({ artDiskLocation });
          } catch (error) {
            console.log("File Not Found");
          }

          // Update Database
          const queryUpdate =
            "UPDATE `submissions` SET `art_file` = ? WHERE `id` = ?";
          const { affectedRows } = await pool.query(queryUpdate, ["", id]);
          //console.log({ affectedRows });
        }
      }

      conn.end();
      res.sendStatus(202);
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

// Upload multiple files
router.post(
  "/submit-artwork",
  passport.authenticate("jwt-admin"),
  cpUpload,
  async (req, res, next) => {
    const { artistName, contactEmail, title, description } = req.body;
    const adminEmail = req.user.contactEmail;
    const cleanArtistName = cleanStringShopify(artistName);

    const formattedCreatedAt = new Date().toLocaleTimeString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    const submitLog = JSON.stringify([
      {
        logInfo: `${adminEmail} submitted artwork for ${cleanArtistName}`,
        logTimestamp: formattedCreatedAt,
      },
    ]);

    const [artFile] = req.files["artFile"];
    const [previewArt] = req.files["previewArt"];

    const artistDirectory = `${FILE_DIRECTORY}/${cleanArtistName}`;
    const artFileNewPath = `${artistDirectory}/${Date.now()}_${cleanFileName(
      artFile.originalname
    )}`;
    const previewArtNewPath = `${artistDirectory}/${Date.now()}_${cleanFileName(
      previewArt.originalname
    )}`;

    let conn;
    try {
      // Create Artist Directory if not exist
      !fs.existsSync(artistDirectory) && fs.mkdirSync(artistDirectory);
      conn = await pool.getConnection();

      fs.renameSync(artFile.path, artFileNewPath);
      fs.renameSync(previewArt.path, previewArtNewPath);

      const insertQueryString =
        "INSERT INTO `submissions` (`artist_name`, `username_contact_email`, " +
        "`title`, `description`, `art_file`, `preview_art`, `logs`) VALUES (?,?,?,?,?,?,?)";

      const correctedArtFileNewPath = artFileNewPath.replace(/\.\.\//g, "");
      const correctedPreviewArtNewPath = previewArtNewPath.replace(
        /\.\.\//g,
        ""
      );

      const insertValues = [
        artistName,
        contactEmail,
        title,
        description,
        `/api/${correctedArtFileNewPath}`,
        `/api/${correctedPreviewArtNewPath}`,
        submitLog,
      ];

      /**
       * @return {InsertDatabaseResponse}
       */
      const { insertId } = await pool.query(insertQueryString, insertValues);

      const selectQueryString =
        "SELECT `id`, `artist_name` AS `artistName`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`created_at` AS `createdAt` FROM `submissions` WHERE `id`=?";
      /**
       * @return {SubmissionDetails}
       */
      const [submissionDetails] = await pool.query(selectQueryString, [
        insertId,
      ]);

      conn.end();
      /**
       * @returns {SubmissionDetails[]}
       */
      res.status(200).json({ submissionDetails });
    } catch (error) {
      console.log(error);
      conn.end();
      next(error);
    }
  }
);

export default router;

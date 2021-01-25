import fs from "fs";
import express from "express";
import multer from "multer";
import { cleanFileName } from "../../../utils/cleanData";
import passport from "passport";
import pool from "../../../database/connection";

/**
 * Database queries return an array. Even if 1 item exists.
 * @typedef {{
 *   artFile:String,
 *   artistName:String,
 *   description:String,
 *   previewArt:String,
 *   status:String,
 *   title:String,
 * }} SubmissionDetails
 *
 * The response object after inserting into database
 * @typedef {{
 *   affectedRows:Number,
 *   insertId:Number,
 *   warningStatus:Number,
 * }} InsertDatabaseResponse
 */

const { NODE_ENV } = process.env;
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

// Single File, Just artFile
router.post(
  "/submit-art-file",
  upload.single("artFile"),
  passport.authenticate("jwt"),
  async (req, res, next) => {
    const { originalname, path: oldSubmissionPath } = req.file;
    const { cleanArtistName } = req.user;
    const artFileNewPath = `${FILE_DIRECTORY}/${cleanArtistName}/${Date.now()}_${cleanFileName(
      originalname
    )}`;

    let conn;

    const insertQueryString =
      "INSERT INTO `submissions` (`artist_name`, `username_contact_email`, " +
      "`title`, `description`, `art_file`) VALUES (?,?,?,?,?)";

    const insertValues = [
      artistName,
      contactEmail,
      title,
      description,
      `/api/${artFileNewPath}`,
    ];

    try {
      /**
       * @return {InsertDatabaseResponse}
       */
      const { insertId } = await pool.query(insertQueryString, insertValues);

      const selectQueryString =
        "SELECT `artist_name` AS `artistName`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`created_at` AS `createdAt` FROM `submissions` WHERE `id`=?";
      /**
       * @return {SubmissionDetails}
       */
      const submissionDetails = await pool.query(selectQueryString, [insertId]);

      conn.end();

      fs.renameSync(oldSubmissionPath, newPath);
      res.json({
        field: req.body,
        image: req.file,
        artFileNewPath,
        message: "file uploaded!",
        submissionDetails,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Upload multiple files
router.post(
  "/submit-artwork",
  passport.authenticate("jwt"),
  cpUpload,
  async (req, res, next) => {
    const { title, description } = req.body;
    const { contactEmail, cleanArtistName, artistName } = req.user;

    const formattedCreatedAt = new Date().toLocaleTimeString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    const submitLog = JSON.stringify([
      {
        logInfo: `${artistName} submitted artwork`,
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
      conn.end();
      next(error);
    }
  }
);

// Sending all submissions to client.
// Client will be sorting the artworks by their status
router.get(
  "/submissions/:status",
  passport.authenticate("jwt"),
  async (req, res, next) => {
    const { artistName } = req.user;
    const { status } = req.params;

    let conn;
    try {
      conn = await pool.getConnection();
      let queryString =
        "SELECT `id`, `artist_name` AS `artistName`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`created_at` AS `createdAt` FROM `submissions`" +
        "WHERE `artist_name`=? ";

      if (status) {
        queryString += "AND `status`='" + status + "' ";
      }

      queryString += "ORDER BY `created_at` DESC";

      /**
       * @return {SubmissionDetails[]}
       */
      const submissionsDetailsArr = await pool.query(queryString, [artistName]);
      conn.end();

      res.status(200).json({ submissionsDetailsArr });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

// Get one submissions to edit
router.get(
  "/submissions/edit/:id",
  passport.authenticate("jwt"),
  async (req, res, next) => {
    const { artistName } = req.user;
    const { id } = req.params;
    let conn;
    try {
      conn = await pool.getConnection();
      const queryString =
        "SELECT `id`, `artist_name` AS `artistName`, `title`, `description`, " +
        "`art_file` AS `artFile`, `preview_art` AS `previewArt`, `status`, " +
        "`created_at` AS `createdAt` FROM `submissions` WHERE `id`=?";
      /**
       * @return {SubmissionDetails}
       */
      const [submissionDetails] = await pool.query(queryString, [id]);
      conn.end();

      if (submissionDetails.artistName === artistName) {
        res.status(200).json({ submissionDetails });
      } else {
        res.status(401).json({
          message: "Artwork not found",
        });
      }
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

// Update Submissions
router.put(
  "/submissions/edit/:id",
  passport.authenticate("jwt"),
  cpUpload,
  async (req, res, next) => {
    const { id, title, description } = req.body;
    const { cleanArtistName } = req.user;

    let conn;

    const [artFile] = req.files["artFile"];
    const [previewArt] = req.files["previewArt"];

    const artistDirectory = `${FILE_DIRECTORY}/${cleanArtistName}`;
    const artFileNewPath = `${artistDirectory}/${Date.now()}_${cleanFileName(
      artFile.originalname
    )}`;
    const previewArtNewPath = `${artistDirectory}/${Date.now()}_${cleanFileName(
      previewArt.originalname
    )}`;

    try {
      conn = await pool.getConnection();

      // Delete old art files path
      const getOldArtFileLocation =
        "SELECT `art_file` AS `artFile`, `preview_art` AS `previewArt` " +
        "FROM `submissions` WHERE `id`=?";

      const [oldArtwork] = await pool.query(getOldArtFileLocation, [id]);
      const { artFile: oldArtFile, previewArt: oldPreviewArt } = oldArtwork;

      // Create file first
      // replace
      fs.renameSync(artFile.path, artFileNewPath);
      fs.renameSync(previewArt.path, previewArtNewPath);

      // Then delete old files
      //Append
      fs.unlinkSync(oldArtFile.replace("/api/", "../../"));
      fs.unlinkSync(oldPreviewArt.replace("/api/", "../../"));

      // Update Table
      const queryString =
        "UPDATE `submissions` SET `title`=?, `description`=?, `art_file`=?, " +
        "`preview_art`=? WHERE `id`=?";

      const correctedArtFileNewPath = artFileNewPath.replace(/\.\.\//g, "");
      const correctedPreviewArtNewPath = previewArtNewPath.replace(
        /\.\.\//g,
        ""
      );

      const updateValues = [
        title,
        description,
        `/api/${correctedArtFileNewPath}`,
        `/api/${correctedPreviewArtNewPath}`,
        id,
      ];

      const { affectedRows } = await pool.query(queryString, updateValues);

      conn.end();

      if (affectedRows > 1) {
        // TODO: If more than 1 row is affected do something
        console.log(artistName, req.user);
      }

      res.status(200).json({
        message: "Successfully updated.",
      });
    } catch (error) {
      conn.end();
      next(error);
    }
  }
);

export default router;

import express from "express";
import passport from "passport";
import pool from "../../../database/connection";

/**
 * Complete Artist Profile
 * @typedef {{
 *    artistName:String,
 *    firstName:String,
 *    lastName:String,
 *    contactEmail:String,
 *    paypalEmail:String,
 *    phoneNumber:String,
 *    social_facebook:String,
 *    social_instagram:String,
 *    social_twitter:String,
 *    isInternational:Boolean,
 *  }} ArtistProfile
 */

const router = express.Router();

router.get("/artists-names", passport.authenticate("jwt-admin"), async(req, res, next) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const data = await pool.query("SELECT `artist_name` AS `artistName`, `username_contact_email` AS `contactEmail`, `paypal_email` AS `paypalEmail` FROM `artist_profile`");

    const artistNamesArr = data.filter(element => element.artistName !== "");

    res.status(200).json(artistNamesArr);

    conn.end();
  } catch (error) {
    conn.end();
    return next(error);
  }
})

router.post(
  "/artists-profiles",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    const { search } = req.body;
    let conn;
    try {
      conn = await pool.getConnection();
      const [artistProfile] = await pool.query(
        "SELECT `id`, `artist_name` AS `artistName`, " +
          "`first_name` AS `firstName`, " +
          "`last_name` AS `lastName`, " +
          "`username_contact_email` AS `contactEmail`, " +
          "`paypal_email` AS `paypalEmail`, " +
          "`phone` AS `phoneNumber`, " +
          "`social_facebook` AS `socialFacebook`, " +
          "`social_instagram` AS `socialInstagram`, " +
          "`social_twitter` AS `socialTwitter`, " +
          "`is_international` FROM `artist_profile` " +
          "WHERE `artist_name` LIKE ? " +
          "OR `username_contact_email` LIKE ? " +
          "OR `paypal_email` LIKE ?",
          [`${search}%`, `${search}%`, `${search}%`]
      );

      conn.end();

      artistProfile.isInternational = artistProfile.is_international
        ? true
        : false;

      /**
       * @return {ArtistProfile}
       */
      res.status(200).json({ artistProfile });
    } catch (error) {
      console.log(error);
      conn.end();
      return next(error);
    }
  }
);

router.put(
  "/artists-profiles",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;

    const {
      id,
      artistName,
      firstName,
      lastName,
      contactEmail,
      paypalEmail,
      phoneNumber,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      isInternational,
    } = req.body;

    try {
      conn = await pool.getConnection();

      const { affectedRows } = await pool.query(
        "UPDATE `artist_profile` " +
          "SET `artist_name` = ?, `first_name` = ?, `last_name` = ?, `username_contact_email` = ?, " +
          "`paypal_email` = ?, `phone` = ?, `social_facebook` = ?, `social_instagram` = ?, `social_twitter` = ?, `is_international` = ? " +
          "WHERE `id` = ?",
        [
          artistName,
          firstName,
          lastName,
          contactEmail,
          paypalEmail,
          phoneNumber,
          socialFacebook,
          socialInstagram,
          socialTwitter,
          isInternational,
          id,
        ]
      );

      conn.end();

      res.status(200).json({
        message: "Artist Profile Updated.",
      });
    } catch (error) {
      conn.end();
      return next(error);
    }
  }
);

router.delete(
  "/artists-profiles/:id",
  passport.authenticate("jwt-admin"),
  async (req, res, next) => {
    let conn;

    const { id } = req.params;
    try {
      conn = await pool.getConnection();
      const {
        affectedRows,
      } = await pool.query("DELETE FROM `artist_profile` WHERE `id` = ?", [id]);
      conn.end();

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import pool from "../../../database/connection";
import { secret } from "../../../services/jwtConfig";
import { cleanStringShopify } from "../../../utils/cleanData";

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

router.get("/profile", passport.authenticate("jwt"), async (req, res, next) => {
  const { contactEmail } = req.user;
  let conn;
  try {
    conn = await pool.getConnection();
    const [
      artistProfile,
    ] = await pool.query(
      "SELECT `artist_name` AS `artistName`, " +
        "`first_name` AS `firstName`, " +
        "`last_name` AS `lastName`, " +
        "`username_contact_email` AS `contactEmail`, " +
        "`paypal_email` AS `paypalEmail`, " +
        "`phone` AS `phoneNumber`, " +
        "`social_facebook` AS `socialFacebook`, " +
        "`social_instagram` AS `socialInstagram`, " +
        "`social_twitter` AS `socialTwitter`, " +
        "`is_international` FROM `artist_profile` " +
        "WHERE `username_contact_email`=?",
      [contactEmail]
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
    conn.end();
    return next(error);
  }
});

router.post(
  "/profile",
  passport.authenticate("jwt"),
  async (req, res, next) => {
    let conn;
    const {
      artistName,
      firstName,
      lastName,
      paypalEmail,
      phoneNumber,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      isInternational,
    } = req.body;

    const { id, contactEmail, is_admin } = req.user;

    // Update Token
    const jwtToken = {
      id,
      contactEmail,
      is_admin,
    };

    try {
      conn = await pool.getConnection();
      const {
        affectedRows,
      } = await pool.query(
        "INSERT INTO `artist_profile` " +
          "(`artist_name`, `first_name`, `last_name`, `username_contact_email`, " +
          "`paypal_email`, `phone`, `social_facebook`, `social_instagram`, " +
          "`social_twitter`, `is_international`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
        ]
      );

      if (affectedRows > 1) {
        // TODO: If more than 1 row is affected do something
        console.log(artistName, req.user);
      }

      const [
        artistProfile,
      ] = await pool.query(
        "SELECT `artist_name` AS `artistName`, " +
          "`first_name` AS `firstName`, " +
          "`last_name` AS `lastName`, " +
          "`username_contact_email` AS `contactEmail`, " +
          "`paypal_email` AS `paypalEmail`, " +
          "`phone` AS `phoneNumber`, " +
          "`social_facebook` AS `socialFacebook`, " +
          "`social_instagram` AS `socialInstagram`, " +
          "`social_twitter` AS `socialTwitter`, " +
          "`is_international` FROM `artist_profile` " +
          "WHERE `username_contact_email`=?",
        [contactEmail]
      );
      conn.end();

      artistProfile.isInternational = artistProfile.is_international
        ? true
        : false;

      jwtToken.cleanArtistName = cleanStringShopify(artistProfile.artistName);
      jwtToken.artistName = artistProfile.artistName;

      const token = jwt.sign(jwtToken, secret, {
        expiresIn: 60 * 60 * 24 * 90,
      });

      /**
       * @return {message:String, artistProfile:ArtistProfile}
       */
      res.status(200).json({
        message: "Artist Created",
        artistProfile,
        token,
      });
    } catch (error) {
      conn.end();
      if (error.code === "ER_DUP_ENTRY") {
        error.message =
          "Artist name has already been taken. Please contact us if this is in error.<br />Please remember to use the same email as your shopify email. <br /><b>You may already have an artist account.</b>";
        error.status = 409;
      } else {
        console.log("error.message: ", error.message);
        error.status = 500;
      }
      next(error);
    }
  }
);

router.put("/profile", passport.authenticate("jwt"), async (req, res, next) => {
  let conn;
  const {
    artistName,
    firstName,
    lastName,
    paypalEmail,
    phoneNumber,
    socialFacebook,
    socialInstagram,
    socialTwitter,
    isInternational,
  } = req.body;

  const { contactEmail } = req.user;

  try {
    conn = await pool.getConnection();
    const {
      affectedRows,
    } = await pool.query(
      "UPDATE `artist_profile` SET `first_name`=?, `last_name`=?, " +
        "`paypal_email`=?, `phone`=?, `social_facebook`=?, `social_instagram`=?, " +
        "`social_twitter`=?, `is_international`=? WHERE `artist_name`=?",
      [
        firstName,
        lastName,
        paypalEmail,
        phoneNumber,
        socialFacebook,
        socialInstagram,
        socialTwitter,
        isInternational,
        artistName,
      ]
    );

    if (affectedRows > 1) {
      // TODO: If more than 1 row is affected do something
      console.log(artistName, req.user);
    }

    const [
      artistProfile,
    ] = await pool.query(
      "SELECT `artist_name` AS `artistName`, " +
        "`first_name` AS `firstName`, " +
        "`last_name` AS `lastName`, " +
        "`username_contact_email` AS `contactEmail`, " +
        "`paypal_email` AS `paypalEmail`, " +
        "`phone` AS `phoneNumber`, " +
        "`social_facebook` AS `socialFacebook`, " +
        "`social_instagram` AS `socialInstagram`, " +
        "`social_twitter` AS `socialTwitter`, " +
        "`is_international` FROM `artist_profile` " +
        "WHERE `username_contact_email`=?",
      [contactEmail]
    );
    conn.end();

    artistProfile.isInternational = artistProfile.is_international
      ? true
      : false;

    res.status(200).json({
      message: "Artist Profile Updated.",
      artistProfile,
    });
  } catch (error) {
    conn.end();
    next(error);
  }
});

router.delete(
  "/profile",
  passport.authenticate("jwt"),
  async (req, res, next) => {
    const { id, contactEmail } = req.user;
    try {
      let conn;
      conn = await pool.getConnection();
      const {
        affectedRows,
      } = await pool.query(
        "DELETE FROM `artist_profile` WHERE `username_contact_email`=?",
        [contactEmail]
      );
      conn.end();

      if (affectedRows > 1) {
        // TODO: Report why there are more than 1 items deleted
        console.log({ id: id, contactEmail });
      }

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/test-artist-profile", (req, res) => {
  res.status(200).send({
    message: "artist found in db",
    isAuth: req.isAuthenticated(),
  });
});

export default router;

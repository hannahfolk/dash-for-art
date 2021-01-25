import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { polyfill } from "es6-promise";
import isomorphicFetch from "isomorphic-fetch";
import pool from "../../../database/connection";
import { secret, BCRYPT_SALT_ROUNDS } from "../../../services/jwtConfig.js";
import { cleanStringShopify } from "../../../utils/cleanData";
import { resetEmail } from "../../../services/email";

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
 *
 * @typedef {{
 *   contactEmail:String,
 *   isAdmin:Boolean,
 * }} UserAccount
 *
 */

const router = express.Router();

/**
 * Login and Register share the same req.login strategies
 * If a new user signs up or logins they are checked if they have an artist account
 * Brand new users will need to create an artist account
 * Also for existing artist who already have an artist account but no user account
 *
 * @param  {Object} req   The request object from express
 * @param  {Object} user  The user object from passport
 * @param  {Object} next  The next function to move along errors for express
 * @return {Promise<{token:String, artistProfile:ArtistProfile, userAccount:UserAccount }>}
 */

const reqLogin = (req, user, next) => {
  return new Promise(async (resolve) => {
    try {
      req.login(user, async (error) => {
        if (error) return next(error);
        const { contactEmail, id, is_admin } = user;

        const userProfile = {
          userAccount: {
            contactEmail,
            isAdmin: is_admin,
          },
          artistProfile: null,
        };

        const jwtToken = {
          id,
          contactEmail,
          is_admin,
        };

        let conn;
        try {
          conn = await pool.getConnection();
          // TODO: Change up artist to full artist profile. No more basic
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

          if (artistProfile) {
            artistProfile.isInternational = artistProfile.is_international
              ? true
              : false;

            userProfile.artistProfile = artistProfile;
            jwtToken.cleanArtistName = cleanStringShopify(
              artistProfile.artistName
            );
            jwtToken.artistName = artistProfile.artistName;
          }
        } catch (error) {
          conn.end();
          return next(error);
        }

        const token = jwt.sign(jwtToken, secret, {
          expiresIn: 60 * 60 * 24 * 90,
        });

        resolve({ token, ...userProfile });
      });
    } catch (error) {
      next(error);
    }
  });
};

router.post("/register", (req, res, next) => {
  passport.authenticate("register", async (err, user, info) => {
    if (err) return next(err);

    const { token, ...userProfile } = await reqLogin(req, user, next);

    res.status(200).json({
      auth: true,
      message: "User Created & Logged In",
      token,
      ...userProfile,
    });
  })(req, res, next);
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("signin", async (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      const { status, message } = info;
      return res.status(status || 401).json({ status, message });
    }

    const { token, ...userProfile } = await reqLogin(req, user, next);

    res.status(200).send({
      auth: true,
      message: "User Found & Logged In",
      token,
      ...userProfile,
    });
  })(req, res, next);
});

router.post("/forgot-password", (req, res, next) => {
  passport.authenticate("forgot-password", async (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      const { status, message } = info;
      return res.status(status || 401).json({ status, message });
    }

    const { contactEmail, resetPasswordToken } = user;

    try {
      const result = await resetEmail(contactEmail, resetPasswordToken);
      res.status(200).json({
        message: "Reset Email Sent success",
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

router.post("/reset-password", (req, res, next) => {
  passport.authenticate("reset-password", async (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      const { status, message } = info;
      return res.status(status || 401).json({ status, message });
    }

    const { token, ...userProfile } = await reqLogin(req, user, next);

    res.status(200).send({
      auth: true,
      message: "User Found & Logged In",
      token,
      ...userProfile,
    });
  })(req, res, next);
});

router.put("/account", passport.authenticate("jwt"), async (req, res, next) => {
  const { id, contactEmail: oldContactEmail } = req.user;
  const { newPassword, newContactEmail } = req.body;
  let conn;

  // TODO: rewrite this.
  // Rewrite may possibly be switching into Graphql
  try {
    conn = await pool.getConnection();

    // queryString will update for password and/or username
    let queryString = "UPDATE `users` SET";
    const insertArray = [];
    let hasContactEmailChanged =
      newContactEmail && newContactEmail !== oldContactEmail ? true : false;

    // If user POST but nothing to change
    if (!newPassword && !hasContactEmailChanged) {
      return res.sendStatus(304);
    }

    if (!!newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
      queryString += " `password`=?";
      insertArray.push(hashedPassword);
    }

    queryString += !!newPassword && hasContactEmailChanged ? ", " : " ";

    if (hasContactEmailChanged) {
      queryString += "`username_contact_email`=? ";
      insertArray.push(newContactEmail);
    }

    queryString += "WHERE `id`=?";
    insertArray.push(id);

    // "UPDATE `users` SET `password`=? WHERE `id`=?"
    // "UPDATE `users` SET `username_contact_email`=? WHERE `id`=?"
    // "UPDATE `users` SET `password`=?, `username_contact_email`=? WHERE `id`=?"
    const { affectedRows } = await pool.query(queryString, insertArray);

    if (affectedRows > 1) {
      console.log(oldContactEmail, req.user);
    }

    // Once updated is complete need to query the database for the user
    const [user] = await pool.query(
      "SELECT `id`, `is_admin`, " +
        "`username_contact_email` AS `contactEmail` " +
        "FROM `users` WHERE `id`=?",
      [id]
    );

    // Update the artist table if contract email was changed
    if (!!newContactEmail) {
      const {
        affectedRows,
      } = await pool.query(
        "UPDATE `artist_profile` SET `username_contact_email`=?" +
          "WHERE `username_contact_email`=?",
        [newContactEmail, oldContactEmail]
      );

      if (affectedRows > 1) {
        console.log(artistName, req.user);
      }
    }
    conn.end();

    const { token, ...userProfile } = await reqLogin(req, user, next);

    res.status(200).json({
      auth: true,
      message: "User Updated & Logged In",
      token,
      ...userProfile,
    });
  } catch (error) {
    conn.end();
    next(error);
  }
});

router.delete(
  "/account",
  passport.authenticate("jwt"),
  async (req, res, next) => {
    const { id, contactEmail } = req.user;
    try {
      let conn;
      conn = await pool.getConnection();
      const {
        affectedRows,
      } = await pool.query("DELETE FROM `users` WHERE `id`=?", [id]);
      conn.end();

      if (affectedRows > 1) {
        // TODO: Report why there are more than 1 items deleted
        console.log({ id, contactEmail });
      }

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/captcha", async (req, res, next) => {
  const { RECAPTCHA_SERVER_KEY } = process.env;
  const { humanKey } = req.body;

  // Validate Human
  const isHuman = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    },
    body: `secret=${RECAPTCHA_SERVER_KEY}&response=${humanKey}`,
  })
    .then((response) => response.json())
    .then((json) => json.success)
    .catch((err) => {
      throw new Error(`Error in Google Siteverify API. ${err.message}`);
    });

  if (humanKey === null || !isHuman) {
    throw new Error(`YOU ARE NOT A HUMAN.`);
  }

  // The code below will run only after the reCAPTCHA is succesfully validated.
  console.log("Success! This user is a human!");
  res.sendStatus(200);
});

export default router;



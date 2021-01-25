import passport from "passport";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { secret, BCRYPT_SALT_ROUNDS } from "./jwtConfig";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import pool from "../database/connection.js";

/**
 * req.user for JWT token
 * @typedef {{
 *   id:Number,
 *   is_admin:Boolean,
 *   contactEmail:String,
 *   cleanArtistName:String
 *   artistName:String,
 * }}JWTReqUser
 *
 * Values inside of the JWT token
 * @typedef {{
 *   id:Number,
 *   contactEmail:String,
 *   is_admin:Boolean,
 *   cleanArtistName:String,
 *   artistName:String,
 *   iat:UTCTime
 *   exp:UTCTime
 * }} JWTToken
 *
 */

passport.serializeUser((user, done) => {
  done(null, user);
});

const passRegisterOpt = {
  usernameField: "contactEmail",
  passwordField: "password",
  passReqToCallback: true,
  session: false,
};

passport.use(
  "register",
  new LocalStrategy(
    passRegisterOpt,
    async (req, usernameField, passwordField, done) => {
      let conn;
      try {
        conn = await pool.getConnection();

        // TODO: Either find one and alert or have MariaDB alert not unique
        const hashedPassword = await bcrypt.hash(
          passwordField,
          BCRYPT_SALT_ROUNDS
        );

        const queryString =
          "INSERT INTO `users` (`username_contact_email`, `password`) VALUES (?, ?)";
        await pool.query(queryString, [usernameField, hashedPassword]);

        const [
          user,
        ] = await pool.query(
          "SELECT `id`, `is_admin`, `username_contact_email` AS `contactEmail` " +
            "FROM `users`  WHERE `username_contact_email`=?",
          [usernameField]
        );

        conn.end();
        return done(null, user);
      } catch (error) {
        console.log(error);
        conn.end();
        if (error.code === "ER_DUP_ENTRY") {
          error.message = "User has already been taken.";
          error.status = 409;
        }
        done(error);
      }
    }
  )
);

const passLoginOpt = {
  usernameField: "contactEmail",
  passwordField: "password",
  session: false,
};

passport.use(
  "signin",
  new LocalStrategy(passLoginOpt, async (usernameField, password, done) => {
    let conn;
    try {
      conn = await pool.getConnection();

      const [user] = await pool.query(
        "SELECT `id`, `is_admin`, `password`, " +
          "`username_contact_email` AS `contactEmail` " +
          "FROM `users` WHERE `username_contact_email`=?",
        [usernameField]
      );

      if (!user) {
        conn.end();
        return done(null, false, {
          message: "User Does Not Exist.",
          status: 404,
        });
      }

      if(!user.password) {
        conn.end();
        return done(null, false, {
          message: "Activate your account by resetting your password.",
          status: 405,
        });
      }

      const doesPasswordMatch = await bcrypt.compare(
        password,
        user.password.toString("utf-8")
      );

      if (!doesPasswordMatch) {
        conn.end();
        return done(null, false, {
          message: "Incorrect Password",
          status: 401,
        });
      }

      conn.end();
      return done(null, user);
    } catch (error) {
      console.log(error);
      conn.end();
      if (error.code === "ER_DUP_ENTRY") {
        error.message = "User has already been taken";
        error.status = 409;
      } else {
        console.log("error.message: ", error.message);
        error.status = 500;
      }
      done(error);
    }
  })
);

const passForgotOpt = {
  usernameField: "contactEmail",
  passwordField: "contactEmail",
  session: false,
};

passport.use(
  "forgot-password",
  new LocalStrategy(
    passForgotOpt,
    async (usernameField, passwordField, done) => {
      let conn;
      try {
        conn = await pool.getConnection();

        const [
          user,
        ] = await pool.query(
          "SELECT `id`, `is_admin`, `username_contact_email` AS `contactEmail` " +
            "FROM `users`  WHERE `username_contact_email`=?",
          [usernameField]
        );

        if (!user) {
          console.log(usernameField);
          conn.end();
          return done(null, false, {
            message: "User Does Not Exist.",
            status: 404,
          });
        }

        const token = crypto.randomBytes(20).toString("hex");
        const now = new Date();
        const tokenExpiration = now.setDate(now.getDate() + 5);

        const {
          affectedRows,
        } = await pool.query(
          "UPDATE `users` SET `reset_password_token`=?, " +
            "`reset_password_expires`=? " +
            "WHERE `username_contact_email`=?",
          [token, tokenExpiration, usernameField]
        );

        if (affectedRows > 1) {
          console.error(contactEmail);
        }

        const [
          userWithResetToken,
        ] = await pool.query(
          "SELECT `id`, `is_admin`, `username_contact_email` AS `contactEmail`, " +
            "`reset_password_token` AS `resetPasswordToken`, " +
            "`reset_password_expires` AS `resetPasswordExpires` " +
            "FROM `users`  WHERE `username_contact_email`=?",
          [usernameField]
        );

        conn.end();
        return done(null, userWithResetToken);
      } catch (error) {
        console.log(error);
        conn.end();
        console.log("error.message: ", error.message);
        done(error);
      }
    }
  )
);

const passResetOpt = {
  usernameField: "password",
  passwordField: "password",
  passReqToCallback: true,
  session: false,
};

passport.use(
  "reset-password",
  new LocalStrategy(
    passResetOpt,
    async (req, usernameField, passwordField, done) => {
      const { token } = req.body;
      const now = Date.now();
      let conn;
      try {
        conn = await pool.getConnection();

        const [
          user,
        ] = await pool.query(
          "SELECT `id`, `is_admin`, `username_contact_email` AS `contactEmail`, " +
            "`reset_password_expires` AS `resetPasswordExpires` " +
            "FROM `users`  WHERE `reset_password_token`=?",
          [token]
        );

        if (!user) {
          conn.end();
          return done(null, false, {
            message: "Password reset link my have been used already. Reset a new link.",
            status: 404,
          });
        }

        const { id, resetPasswordExpires } = user;

        if (now > resetPasswordExpires) {
          conn.end();
          return done(null, false, {
            message: "Password reset link is too old please request a new one.",
            status: 404,
          });
        }

        const hashedPassword = await bcrypt.hash(
          passwordField,
          BCRYPT_SALT_ROUNDS
        );

        const {
          affectedRows,
        } = await pool.query(
          "UPDATE `users` SET `reset_password_token`=?, " +
            "`reset_password_expires`=?, `password`=? " +
            "WHERE `id`=?",
          [null, null, hashedPassword, id]
        );

        if (affectedRows > 1) {
          console.error(contactEmail);
        }

        const [
          newUser,
        ] = await pool.query(
          "SELECT `id`, `is_admin`, `password`, " +
            "`username_contact_email` AS `contactEmail` " +
            "FROM `users` WHERE `id`=?",
          [id]
        );

        conn.end();
        return done(null, newUser);
      } catch (error) {
        console.log(error);
        conn.end();
        console.log("error.message: ", error.message);
        done(error);
      }
    }
  )
);

const JWTOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: secret,
};

/**
 * @param {JWTToken} jwt_payload
 */
passport.use(
  "jwt",
  new JWTStrategy(JWTOpts, async (jwt_payload, done) => {
    const { id, cleanArtistName, artistName } = jwt_payload;
    let conn;

    try {
      conn = await pool.getConnection();

      const [user] = await pool.query(
        "SELECT `id`, `is_admin`, " +
          "`username_contact_email` AS `contactEmail` " +
          "FROM `users` WHERE `id`=?",
        [id]
      );
      conn.end();

      if (user) {
        user.cleanArtistName = cleanArtistName;
        user.artistName = artistName;
        /**
         * @return {JWTReqUser}
         */
        return done(null, { ...user });
      } else {
        // 401 Unauthorized would be sent to user
        return done(null, false, {
          message: "Unable To Locate User.",
          status: 401,
        });
      }
    } catch (error) {
      console.log(error);
      conn.end();
      done(error);
    }
  })
);

const JWTSubmissions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: secret,
  passReqToCallback: true,
};

/**
 * @param {JWTToken} jwt_payload
 */
passport.use(
  "jwt-submissions",
  new JWTStrategy(JWTSubmissions, async (req, jwt_payload, done) => {
    const { id, cleanArtistName, artistName, is_admin } = jwt_payload;
    const { originalUrl } = req;
    let conn;

    if (!is_admin && !originalUrl.includes(cleanArtistName)) {
      return done(null, false, {
        message: "Unauthorized for this Image",
        status: 401,
      });
    }

    try {
      conn = await pool.getConnection();

      const [user] = await pool.query(
        "SELECT `id`, `is_admin`, " +
          "`username_contact_email` AS `contactEmail` " +
          "FROM `users` WHERE `id`=?",
        [id]
      );
      conn.end();

      if (user) {
        user.cleanArtistName = cleanArtistName;
        user.artistName = artistName;
        /**
         * @return {JWTReqUser}
         */
        return done(null, { ...user });
      } else {
        // 401 Unauthorized would be sent to user
        return done(null, false, {
          message: "Unable To Locate User.",
          status: 401,
        });
      }
    } catch (error) {
      console.log(error);
      conn.end();
      done(error);
    }
  })
);

/**
 * @param {JWTToken} jwt_payload
 */
passport.use(
  "jwt-admin",
  new JWTStrategy(JWTOpts, async (jwt_payload, done) => {
    const { id } = jwt_payload;
    let conn;

    try {
      conn = await pool.getConnection();

      const [user] = await pool.query(
        "SELECT `id`, `is_admin`, " +
          "`username_contact_email` AS `contactEmail` " +
          "FROM `users` WHERE `id`=?",
        [id]
      );
      conn.end();

      if (!user.is_admin) {
        return done(null, false, {
          message: "Not Admin",
          status: 401,
        });
      }

      if (user) {
        /**
         * @return {JWTReqUser}
         */
        return done(null, { ...user });
      } else {
        // 401 Unauthorized would be sent to user
        return done(null, false, {
          message: "Unable To Locate User.",
          status: 401,
        });
      }
    } catch (error) {
      console.log(error);
      conn.end();
      done(error);
    }
  })
);

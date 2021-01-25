const { JWT_SECRET, BCRYPT_SALT_ROUNDS } = process.env;

module.exports = {
  secret: JWT_SECRET,
  BCRYPT_SALT_ROUNDS: parseInt(BCRYPT_SALT_ROUNDS, 10),
};

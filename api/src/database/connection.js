import { createPool } from "mariadb";
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

export default createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  timezone: 'utc',
});

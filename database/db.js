const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.DBUSERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

module.exports = connection;

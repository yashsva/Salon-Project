const mysql = require('mysql2');

//To get API keys from .env files (Using process.env.<variable_name> )
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true,
})

module.exports = pool.promise();
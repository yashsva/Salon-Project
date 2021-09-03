const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

//To get API keys from .env files (Using process.env.<variable_name> )
require('dotenv').config();

const ssl_cert=fs.readFileSync(path.join(__dirname,"..","DigiCertGlobalRootCA.crt.pem"));

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true,
    ssl:{
        ca:ssl_cert,
    }
})

module.exports = pool.promise();
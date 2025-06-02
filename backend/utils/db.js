// require('./loadEnv');

// let pool;

// if (process.env.NODE_ENV === 'development') {
//   // MySQL setup
//   const mysql = require('mysql2/promise');
//   pool = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD || '',
//     database: process.env.MYSQL_DB,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//   });
// } else if (process.env.NODE_ENV === 'staging') {
//   // PostgreSQL setup
//   const { Pool } = require('pg');
//   pool = new Pool({
//     host: process.env.PG_HOST,
//     port: process.env.PG_PORT || 5432,
//     user: process.env.PG_USER,
//     password: process.env.PG_PASSWORD,
//     database: process.env.PG_DB,
//   });
// } else {
//   throw new Error('Invalid NODE_ENV value. Must be "development" or "staging".');
// }

// module.exports = pool;

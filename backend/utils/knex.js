const environment = process.env.NODE_ENV || "staging";
const config = require("./knexfile")[environment];
module.exports = require("knex")(config);
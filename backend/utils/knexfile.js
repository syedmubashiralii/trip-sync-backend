// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'trip_sync',
      user: process.env.DB_USER  || 'root',
    },
  },
  staging: {
    client: "postgresql",
    connection: {
      host: process.env.PG_HOST,
      database: process.env.PG_DB,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      // tableName: "knex_migrations",
    },
  },
  production: {
    client: "mysql",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      // tableName: "knex_migrations",
    },
  },
};

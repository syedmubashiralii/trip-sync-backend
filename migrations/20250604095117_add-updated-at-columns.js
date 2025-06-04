exports.up = function(knex) {
  return Promise.all([
    knex.schema.alterTable('users', table => {
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    }),
    knex.schema.alterTable('companies', table => {
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    }),
    knex.schema.alterTable('tour_guides', table => {
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.alterTable('users', table => {
      table.dropColumn('updated_at');
    }),
    knex.schema.alterTable('companies', table => {
      table.dropColumn('updated_at');
    }),
    knex.schema.alterTable('tour_guides', table => {
      table.dropColumn('updated_at');
    }),
  ]);
};

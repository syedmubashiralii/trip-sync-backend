exports.up = function(knex) {
  return knex.schema
    // users
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name', 100);
      table.string('email', 100).unique();
      table.string('password', 255);
      table.string('profile_image', 255);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.string('phone', 255);
      table.string('reset_otp', 6);
      table.datetime('otp_expiry');
      table.boolean('email_verified').defaultTo(false);
    })

    // companies
    .createTable('companies', function(table) {
      table.increments('id').primary();
      table.string('name', 100);
      table.string('reg_no', 100);
      table.string('email', 100).unique();
      table.string('password', 255);
      table.string('profile_image', 255);
      table.text('description');
      table.boolean('is_active').defaultTo(true);
      table.boolean('is_blocked').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.string('phone', 255);
      table.string('reset_otp', 6);
      table.datetime('otp_expiry');
      table.boolean('email_verified').defaultTo(false);
    })

    // tour_guides
    .createTable('tour_guides', function(table) {
      table.increments('id').primary();
      table.string('name', 100);
      table.string('email', 100).unique();
      table.string('password', 255);
      table.string('phone', 20);
      table.text('bio');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.string('profile_image', 255);
      table.string('reset_otp', 6);
      table.datetime('otp_expiry');
      table.boolean('email_verified').defaultTo(false);
    })

    // catalogues
    .createTable('catalogues', function(table) {
      table.increments('id').primary();
      table.integer('company_id').unsigned().references('id').inTable('companies').onDelete('CASCADE');
      table.string('name');
      table.text('description');
      table.decimal('price');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })

    // catalogue_images
    .createTable('catalogue_images', function(table) {
      table.increments('id').primary();
      table.integer('catalogue_id').unsigned().references('id').inTable('catalogues').onDelete('CASCADE');
      table.string('image_url');
    })

    // bookings
    .createTable('bookings', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('catalogue_id').unsigned().references('id').inTable('catalogues').onDelete('CASCADE');
      table.timestamp('booking_date').defaultTo(knex.fn.now());
      table.string('status');
    })

    // reviews
    .createTable('reviews', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('catalogue_id').unsigned().references('id').inTable('catalogues').onDelete('CASCADE');
      table.integer('rating');
      table.text('comment');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })

    // company_tour_guides (many-to-many)
    .createTable('company_tour_guides', function(table) {
      table.increments('id').primary();
      table.integer('company_id').unsigned().references('id').inTable('companies').onDelete('CASCADE');
      table.integer('guide_id').unsigned().references('id').inTable('tour_guides').onDelete('CASCADE');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('company_tour_guides')
    .dropTableIfExists('reviews')
    .dropTableIfExists('bookings')
    .dropTableIfExists('catalogue_images')
    .dropTableIfExists('catalogues')
    .dropTableIfExists('tour_guides')
    .dropTableIfExists('companies')
    .dropTableIfExists('users');
};

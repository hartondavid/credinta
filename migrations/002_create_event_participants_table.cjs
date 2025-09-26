/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('event_participants', function (table) {
        table.increments('id').primary();
        table.string('event_id', 255).notNullable();
        table.string('first_name', 255).notNullable();
        table.string('last_name', 255).notNullable();
        table.string('email', 255).notNullable();
        table.boolean('email_confirmed').defaultTo(false);
        table.string('confirmation_token', 255).nullable();
        table.timestamp('expires_at').nullable();
        table.timestamp('confirmed_at').nullable();
        table.timestamps(true, true);

        // Foreign key constraints - commented out since events table uses string IDs
        // table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE');

        // Indexes for performance
        table.index(['event_id']);
        table.index(['email']);
        table.index(['email_confirmed']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('event_participants');
};

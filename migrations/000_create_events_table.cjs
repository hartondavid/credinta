/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('events', function (table) {
        table.string('id', 255).primary();
        table.string('title', 255).notNullable();
        table.text('description').notNullable();
        table.date('date').notNullable();
        table.string('location', 255).notNullable();
        table.string('status', 50).defaultTo('upcoming');
        table.timestamps(true, true);

        // Indexes for performance
        table.index(['date']);
        table.index(['status']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('events');
};

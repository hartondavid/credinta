
exports.up = function (knex) {
    return knex.schema.createTable('contact_messages', function (table) {
        table.increments('id').primary();
        table.string('first_name', 255).notNullable();
        table.string('last_name', 255).notNullable();
        table.string('email', 255).notNullable();
        table.string('phone', 255).notNullable();
        table.text('text_area').notNullable();
        table.timestamps(true, true);

    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('contact_messages');
};

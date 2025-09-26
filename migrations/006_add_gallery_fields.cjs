/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable('posts', function (table) {
        // Add gallery fields
        table.boolean('gallery_flag').defaultTo(false); // Flag pentru galerie
        table.json('gallery_image_ids').defaultTo('[]'); // Array de ID-uri pentru imagini din galerie
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable('posts', function (table) {
        table.dropColumn('gallery_flag');
        table.dropColumn('gallery_image_ids');
    });
};

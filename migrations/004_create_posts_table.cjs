/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('posts', function (table) {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('content').notNullable();
        table.timestamp('created_at').notNullable();
        table.string('post_type').notNullable(); // CONFERINTA, PODCAST, etc.
        table.string('category').notNullable(); // 'project' sau 'news'

        // Câmpuri specifice pentru proiecte
        table.string('project_type').nullable(); // 'past', 'current', 'future'
        table.string('event_type').nullable(); // 'single-day', 'multi-day', 'ongoing'
        table.timestamp('start_date').nullable();
        table.timestamp('end_date').nullable();
        table.string('duration').nullable();
        table.boolean('is_active').defaultTo(false);
        table.json('cloudinary_ids').defaultTo('[]'); // Array de imagini
        table.json('testimonial_videos').defaultTo('[]'); // Array de video-uri

        // Câmpuri pentru galerie
        table.boolean('gallery_flag').defaultTo(false); // Flag pentru galerie
        table.json('gallery_image_ids').defaultTo('[]'); // Array de ID-uri pentru imagini din galerie

        // Câmpuri specifice pentru știri
        table.string('url').nullable(); // URL extern
        table.boolean('read_button').defaultTo(false);

        // Metadate
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.boolean('is_published').defaultTo(true);

        // Indexuri pentru performanță
        table.index(['category', 'post_type']);
        table.index(['project_type']);
        table.index(['created_at']);
        table.index(['is_published']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('posts');
};

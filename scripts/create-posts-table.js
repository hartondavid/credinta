import databaseManager from '../database.mjs';

async function runPostsMigration() {
    try {
        console.log('🔄 Running posts table migration...');

        const knex = await databaseManager.getKnex();

        // Check if table already exists
        const tableExists = await knex.schema.hasTable('posts');

        if (tableExists) {
            console.log('✅ Posts table already exists');
            return;
        }

        // Create the posts table
        await knex.schema.createTable('posts', function (table) {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.text('content').notNullable();
            table.string('author').notNullable();
            table.timestamp('created_at').notNullable();
            table.json('tags').defaultTo('[]');
            table.string('post_type').notNullable();
            table.string('category').notNullable();

            // Câmpuri specifice pentru proiecte
            table.string('project_type').nullable();
            table.string('event_type').nullable();
            table.timestamp('start_date').nullable();
            table.timestamp('end_date').nullable();
            table.string('duration').nullable();
            table.boolean('is_active').defaultTo(false);
            table.json('cloudinary_ids').defaultTo('[]');
            table.json('testimonial_videos').defaultTo('[]');

            // Câmpuri specifice pentru știri
            table.string('url').nullable();
            table.boolean('read_button').defaultTo(false);

            // Metadate
            table.timestamp('updated_at').defaultTo(knex.fn.now());
            table.boolean('is_published').defaultTo(true);

            // Indexuri
            table.index(['category', 'post_type']);
            table.index(['project_type']);
            table.index(['created_at']);
            table.index(['is_published']);
        });

        console.log('✅ Posts table created successfully!');

        // Insert sample data
        await knex('posts').insert([
            {
                title: 'Echilibrul dintre o minte sănătoasă si un corp sănătos',
                content: 'Adresez mulțumiri sincere echipei Bibliotecii Județene Alexandru Odobescu din Călărași, doamnei manager Ionela Ichim și doamnei Simona Claciu pentru onoranta invitație din data de 23 iulie 2024. A fost o deosebită plăcere și un privilegiu să discut cu adolescenții despre importanța sportului în viața cotidiană.',
                author: 'Lorem Ipsum',
                created_at: new Date('2024-07-23T14:30:00Z'),
                tags: JSON.stringify(['lorem', 'videoCarousel2', 'leftPhotoCarousel2']),
                post_type: 'CONFERINTA',
                category: 'project',
                project_type: 'past',
                is_published: true
            },
            {
                title: 'Spune-mi despre Călărași – Sezonul 4, Ep. 4 - Iulian Vasile',
                content: 'În acest episod al podcastului "Spune-mi despre Călărași", moderatoarea Georgiana Șerban l-a avut ca invitat pe Iulian Vasile, președintele Asociației "Alege să trăiești" și al Clubului Sportiv "Călărași Warriors".',
                author: 'Lorem Ipsum',
                created_at: new Date('2025-07-15T10:00:00Z'),
                tags: JSON.stringify(['videoCarousel', 'leftPhotoCarousel']),
                post_type: 'PODCAST',
                category: 'news',
                is_published: true
            }
        ]);

        console.log('✅ Sample data inserted successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await databaseManager.disconnect();
    }
}

// Run the migration
runPostsMigration();

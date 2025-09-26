const knex = require('knex');
const knexConfig = require('../knexfile.cjs');

async function addYouTubeVideosField() {
    const db = knex(knexConfig);

    try {
        console.log('🔄 Adding youtube_videos field to posts table...');

        // Check if column already exists
        const hasColumn = await db.schema.hasColumn('posts', 'youtube_videos');

        if (hasColumn) {
            console.log('✅ youtube_videos column already exists');
        } else {
            // Add the column
            await db.schema.alterTable('posts', function (table) {
                table.json('youtube_videos').defaultTo('[]');
            });

            console.log('✅ Successfully added youtube_videos field to posts table');
        }

        // Update existing records to have empty array
        await db('posts').whereNull('youtube_videos').update({
            youtube_videos: JSON.stringify([])
        });

        console.log('✅ Updated existing records with empty youtube_videos array');

    } catch (error) {
        console.error('❌ Error adding youtube_videos field:', error);
    } finally {
        await db.destroy();
    }
}

addYouTubeVideosField();

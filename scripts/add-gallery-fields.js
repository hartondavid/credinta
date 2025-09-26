import databaseManager from '../database.mjs';

async function addGalleryFields() {
    try {
        console.log('🔄 Adding gallery fields to posts table...');

        const knex = await databaseManager.getKnex();

        // Check if table exists
        const tableExists = await knex.schema.hasTable('posts');
        if (!tableExists) {
            console.log('❌ Posts table does not exist. Please run the posts migration first.');
            return;
        }

        // Add gallery_flag field if it doesn't exist
        const hasGalleryFlag = await knex.schema.hasColumn('posts', 'gallery_flag');
        if (!hasGalleryFlag) {
            await knex.schema.alterTable('posts', function (table) {
                table.boolean('gallery_flag').defaultTo(false);
            });
            console.log('✅ Added gallery_flag field');
        } else {
            console.log('✅ gallery_flag field already exists');
        }

        // Add gallery_image_ids field if it doesn't exist
        const hasGalleryImageIds = await knex.schema.hasColumn('posts', 'gallery_image_ids');
        if (!hasGalleryImageIds) {
            await knex.schema.alterTable('posts', function (table) {
                table.json('gallery_image_ids').defaultTo('[]');
            });
            console.log('✅ Added gallery_image_ids field');
        } else {
            console.log('✅ gallery_image_ids field already exists');
        }

        console.log('🎉 Successfully added gallery fields to posts table!');

    } catch (error) {
        console.error('❌ Error adding gallery fields to posts table:', error);
    } finally {
        await databaseManager.close();
    }
}

addGalleryFields();

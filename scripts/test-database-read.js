import databaseManager from '../database.mjs';

async function testDatabaseRead() {
    try {
        console.log('🔄 Testing database read functionality...');

        const knex = await databaseManager.getKnex();

        if (!knex) {
            console.error('❌ Database connection failed');
            return;
        }

        // Test 1: Check if posts table exists
        const tableExists = await knex.schema.hasTable('posts');
        console.log('📊 Posts table exists:', tableExists);

        if (!tableExists) {
            console.log('⚠️ Posts table does not exist. Run: npm run create-posts-table');
            return;
        }

        // Test 2: Get all posts
        const allPosts = await knex('posts').select('*');
        console.log('📋 Total posts in database:', allPosts.length);

        // Test 3: Get project posts
        const projectPosts = await knex('posts')
            .where({ category: 'project', is_published: true })
            .select('*');
        console.log('🏗️ Project posts:', projectPosts.length);

        // Test 4: Get news posts
        const newsPosts = await knex('posts')
            .where({ category: 'news', is_published: true })
            .select('*');
        console.log('📰 News posts:', newsPosts.length);

        // Test 5: Get posts by project type
        const pastProjects = await knex('posts')
            .where({
                category: 'project',
                project_type: 'past',
                is_published: true
            })
            .select('*');
        console.log('📅 Past projects:', pastProjects.length);

        // Test 6: Sample data
        if (allPosts.length > 0) {
            console.log('📄 Sample post:');
            console.log({
                id: allPosts[0].id,
                title: allPosts[0].title,
                category: allPosts[0].category,
                post_type: allPosts[0].post_type,
                project_type: allPosts[0].project_type,
                created_at: allPosts[0].created_at
            });
        }

        console.log('✅ Database read test completed successfully!');

    } catch (error) {
        console.error('❌ Database read test failed:', error);
    } finally {
        await databaseManager.disconnect();
    }
}

// Run the test
testDatabaseRead();

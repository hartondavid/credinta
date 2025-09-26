const knex = require('knex');
const knexConfig = require('../knexfile.cjs');

async function fixPostsConstraints() {
    // Use development environment by default
    const db = knex(knexConfig.development);

    try {
        console.log('🔄 Fixing posts table constraints...');

        // Drop problematic unique constraints
        console.log('📝 Dropping unique constraints...');
        await db.raw('ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_category_post_type_idx');
        await db.raw('ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_project_type_idx');
        await db.raw('ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_created_at_idx');
        await db.raw('ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_is_published_idx');

        console.log('✅ Unique constraints dropped');

        // Create proper indexes
        console.log('📝 Creating proper indexes...');
        await db.raw('CREATE INDEX IF NOT EXISTS idx_posts_category_post_type ON posts (category, post_type)');
        await db.raw('CREATE INDEX IF NOT EXISTS idx_posts_project_type ON posts (project_type)');
        await db.raw('CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at)');
        await db.raw('CREATE INDEX IF NOT EXISTS idx_posts_is_published ON posts (is_published)');

        console.log('✅ Indexes created');

        // Verify no unique constraints remain
        const constraints = await db.raw(`
      SELECT constraint_name, constraint_type 
      FROM information_schema.table_constraints 
      WHERE table_name = 'posts' AND constraint_type = 'UNIQUE'
    `);

        if (constraints.rows.length === 0) {
            console.log('✅ No unique constraints found - table is ready for multiple posts');
        } else {
            console.log('⚠️  Remaining unique constraints:', constraints.rows);
        }

    } catch (error) {
        console.error('❌ Error fixing constraints:', error);
    } finally {
        await db.destroy();
    }
}

fixPostsConstraints();

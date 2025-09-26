import databaseManager from '../database.mjs';

async function runMigrations() {
    try {
        console.log('🚀 Running migrations...');

        // Run migrations
        await databaseManager.runMigrations();

        console.log('✅ Migrations completed successfully!');

    } catch (error) {
        console.error('❌ Migrations failed:', error.message);
        process.exit(1);
    } finally {
        await databaseManager.disconnect();
        process.exit(0);
    }
}

// Run the migrations
runMigrations();

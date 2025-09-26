import databaseManager from '../database.mjs';

async function resetDatabase() {
    try {
        console.log('🚀 Starting database reset process...');

        // Reset database and run migrations
        await databaseManager.resetAndMigrate();

        console.log('✅ Database reset completed successfully!');
        console.log('🎯 All tables have been recreated with fresh migrations.');

    } catch (error) {
        console.error('❌ Database reset failed:', error.message);
        process.exit(1);
    } finally {
        await databaseManager.disconnect();
        process.exit(0);
    }
}

// Run the reset
resetDatabase();

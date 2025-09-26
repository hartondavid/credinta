#!/usr/bin/env node

import databaseManager from '../database.mjs';

async function runEventMigrations() {
    try {
        console.log('🚀 Starting event participation migrations...');

        // Connect to database
        const knex = await databaseManager.connect();
        console.log('✅ Database connected');

        // Run migrations
        console.log('📋 Running migrations...');
        await databaseManager.runMigrations();

        console.log('✅ Event participation migrations completed successfully!');
        console.log('📊 New table created: event_participants');

        // Verify table exists
        const tableExists = await knex.schema.hasTable('event_participants');
        if (tableExists) {
            console.log('✅ event_participants table verified');

            // Show table structure
            const columns = await knex('event_participants').columnInfo();
            console.log('📋 Table structure:');
            Object.keys(columns).forEach(column => {
                const col = columns[column];
                console.log(`  - ${column}: ${col.type}${col.nullable ? ' (nullable)' : ''}${col.defaultValue ? ` default: ${col.defaultValue}` : ''}`);
            });
        } else {
            console.log('❌ event_participants table not found');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await databaseManager.disconnect();
        console.log('🔌 Database disconnected');
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runEventMigrations();
}

export default runEventMigrations;

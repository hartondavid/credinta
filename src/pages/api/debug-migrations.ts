import type { APIRoute } from 'astro';
import databaseManager from '../../../database.mjs';

export const POST: APIRoute = async () => {
    try {
        console.log('🔍 Debug migrations endpoint called');

        // Check environment
        const environment = process.env.NODE_ENV;
        console.log('🌍 Environment:', environment);

        // Check database connection
        const health = await databaseManager.healthCheck();
        console.log('🏥 Database health:', health);

        // Try to get knex instance
        const knex = await databaseManager.getKnex();
        console.log('🔌 Knex instance obtained:', !!knex);

        if (!knex) {
            throw new Error('Failed to get knex instance');
        }

        // Check if migrations table exists
        let migrationsTableExists = false;
        try {
            const result = await knex.raw("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'knex_migrations')");
            migrationsTableExists = result.rows[0].exists;
            console.log('📋 Migrations table exists:', migrationsTableExists);
        } catch (error: any) {
            console.log('❌ Could not check migrations table:', error.message);
        }

        // Check if contact_messages table exists
        let contactTableExists = false;
        try {
            const result = await knex.raw("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'contact_messages')");
            contactTableExists = result.rows[0].exists;
            console.log('📝 Contact messages table exists:', contactTableExists);
        } catch (error: any) {
            console.log('❌ Could not check contact_messages table:', error.message);
        }

        // List all tables
        let allTables = [];
        try {
            const result = await knex.raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
            allTables = result.rows.map((row: any) => row.table_name);
            console.log('📊 All tables:', allTables);
        } catch (error: any) {
            console.log('❌ Could not list tables:', error.message);
        }

        // Try to run migrations manually
        let migrationResult = null;
        try {
            console.log('🔄 Attempting to run migrations manually...');
            await databaseManager.runMigrations();
            migrationResult = 'success';
            console.log('✅ Manual migrations successful');
        } catch (error: any) {
            migrationResult = error.message;
            console.log('❌ Manual migrations failed:', error.message);
        }

        return new Response(JSON.stringify({
            success: true,
            environment,
            databaseHealth: health,
            knexInstance: !!knex,
            migrationsTableExists,
            contactTableExists,
            allTables,
            migrationResult
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error: any) {
        console.error('❌ Debug endpoint error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

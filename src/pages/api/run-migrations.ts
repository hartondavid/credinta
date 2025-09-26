import type { APIRoute } from 'astro';

export const POST: APIRoute = async () => {
    try {
        console.log('🔄 Starting manual migrations...');

        const { default: databaseManager } = await import('../../../database.mjs');
        const db = await databaseManager.getKnex();

        if (!db) {
            throw new Error('Database connection failed');
        }


        console.log('📊 Database connected, running migrations...');
        await databaseManager.runMigrations();

        console.log('✅ Migrations completed successfully');

        return new Response(JSON.stringify({
            ok: true,
            message: 'Migrările au fost rulate cu succes!'
        }), {
            status: 200,
            headers: { 'content-type': 'application/json' }
        });

    } catch (error: any) {
        console.error('❌ Migration failed:', error);

        return new Response(JSON.stringify({
            ok: false,
            error: `Eroare la rularea migrărilor: ${error.message}`,
            stack: error.stack
        }), {
            status: 500,
            headers: { 'content-type': 'application/json' }
        });
    }
};

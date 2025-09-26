import type { APIRoute } from 'astro';
import databaseManager from '../../../../database.mjs';

export const GET: APIRoute = async ({ params }) => {
    try {
        const { eventId } = params;

        if (!eventId) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Event ID is required'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get database connection
        const db = await databaseManager.getKnex();

        if (!db) {
            throw new Error('Database connection failed');
        }

        // Get participants for this event
        const participants = await (db as any)('event_participants')
            .where('event_id', eventId)
            .orderBy('created_at', 'desc')
            .select('*');

        return new Response(JSON.stringify({
            success: true,
            participants: participants
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error getting event participants:', error);

        return new Response(JSON.stringify({
            success: false,
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

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

        // Get event statistics
        const totalParticipants = await (db as any)('event_participants')
            .where('event_id', eventId)
            .count('* as count');

        const confirmedParticipants = await (db as any)('event_participants')
            .where('event_id', eventId)
            .where('email_confirmed', true)
            .count('* as count');

        const pendingConfirmations = await (db as any)('event_participants')
            .where('event_id', eventId)
            .where('email_confirmed', false)
            .count('* as count');

        const stats = {
            total: parseInt(totalParticipants[0].count as string),
            confirmed: parseInt(confirmedParticipants[0].count as string),
            pending: parseInt(pendingConfirmations[0].count as string)
        };

        return new Response(JSON.stringify({
            success: true,
            ...stats
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error getting event stats:', error);

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

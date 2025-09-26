import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';
import databaseManager from '../../../../../database.mjs';

// Verify admin token
function verifyAdminToken(request: Request): { adminId: number; username: string } | null {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;

        if (decoded.role !== 'admin') {
            return null;
        }

        return { adminId: decoded.adminId, username: decoded.username };
    } catch (error) {
        return null;
    }
}

export const GET: APIRoute = async ({ request }) => {
    try {
        // Check authentication
        const admin = verifyAdminToken(request);
        if (!admin) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const url = new URL(request.url);
        const query = url.searchParams.get('q');

        if (!query || query.trim().length < 2) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const knex = await databaseManager.getKnex();
        if (!knex) {
            return new Response(JSON.stringify({ error: 'Database connection failed' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Search projects by title
        const projects = await knex('posts')
            .where('category', 'project')
            .where('is_published', true)
            .where(function (this: any) {
                this.where('title', 'like', `%${query}%`)
                    .orWhere('content', 'like', `%${query}%`);
            })
            .select('id', 'title', 'created_at', 'content')
            .orderBy('created_at', 'desc')
            .limit(10);

        // Map database fields to frontend expected format
        const mappedProjects = projects.map(project => ({
            id: project.id,
            title: project.title,
            // postType: project.post_type,
            createdAt: project.created_at,
            content: project.content
        }));

        return new Response(JSON.stringify(mappedProjects), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Search projects error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
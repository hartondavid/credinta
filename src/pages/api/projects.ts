import type { APIRoute } from 'astro';
import databaseManager from '../../../database.mjs';

// GET - Citirea postărilor pentru proiecte
export const GET: APIRoute = async ({ url }) => {
    try {
        const knex = await databaseManager.getKnex();

        if (!knex) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Eroare de conexiune la baza de date'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verifică dacă tabela există
        const tableExists = await knex.schema.hasTable('posts');
        if (!tableExists) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Tabela posts nu există'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Parametrii din query string
        const projectType = url.searchParams.get('projectType'); // 'past', 'ongoing', 'future'
        const postType = url.searchParams.get('postType'); // 'CONFERINTA', 'PODCAST', etc.
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        // Construiește query-ul pentru proiecte
        let query = knex('posts')
            .where({
                category: 'project',
                is_published: true
            })
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);

        // Filtrează după tipul de proiect
        if (projectType) {
            query = query.where('project_type', projectType);
        }

        // Filtrează după tipul de postare
        if (postType) {
            query = query.where('post_type', postType);
        }

        const posts = await query;

        // Parsează JSON-urile și transformă în formatul așteptat
        const parsedPosts = posts.map((post: any) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.author,
            createdAt: post.created_at,
            tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags,
            projectType: post.project_type,
            postType: post.post_type,
            eventType: post.event_type,
            startDate: post.start_date,
            endDate: post.end_date,
            duration: post.duration,
            isActive: post.is_active,
            cloudinaryIds: typeof post.cloudinary_ids === 'string' ? JSON.parse(post.cloudinary_ids) : post.cloudinary_ids,
            testimonialVideos: typeof post.testimonial_videos === 'string' ? JSON.parse(post.testimonial_videos) : post.testimonial_videos
        }));

        return new Response(JSON.stringify({
            success: true,
            posts: parsedPosts,
            total: parsedPosts.length
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get project posts error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Eroare la citirea postărilor pentru proiecte'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

import type { APIRoute } from 'astro';
import databaseManager from '../../../database.mjs';

// GET - Citirea tuturor postărilor
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
        const category = url.searchParams.get('category'); // 'project' sau 'news'
        const projectType = url.searchParams.get('projectType'); // 'past', 'ongoing', 'future'
        const postType = url.searchParams.get('postType'); // 'CONFERINTA', 'PODCAST', etc.
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        // Construiește query-ul
        let query = knex('posts')
            .where('is_published', true)
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);

        // Filtrează după categorie
        if (category) {
            query = query.where('category', category);
        }

        // Filtrează după tipul de proiect
        if (projectType) {
            query = query.where('project_type', projectType);
        }

        // Filtrează după tipul de postare
        if (postType) {
            query = query.where('post_type', postType);
        }

        const posts = await query;

        // Parsează JSON-urile
        const parsedPosts = posts.map(post => ({
            ...post,
            tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags,
            cloudinary_ids: typeof post.cloudinary_ids === 'string' ? JSON.parse(post.cloudinary_ids) : post.cloudinary_ids,
            testimonial_videos: typeof post.testimonial_videos === 'string' ? JSON.parse(post.testimonial_videos) : post.testimonial_videos
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
        console.error('Get posts error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Eroare la citirea postărilor'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// GET cu ID specific - citirea unei postări
export const GET_ID: APIRoute = async ({ params }) => {
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

        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({
                success: false,
                error: 'ID-ul postării este obligatoriu'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const post = await knex('posts')
            .where({ id, is_published: true })
            .first();

        if (!post) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Postarea nu a fost găsită'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Parsează JSON-urile
        const parsedPost = {
            ...post,
            tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags,
            cloudinary_ids: typeof post.cloudinary_ids === 'string' ? JSON.parse(post.cloudinary_ids) : post.cloudinary_ids,
            testimonial_videos: typeof post.testimonial_videos === 'string' ? JSON.parse(post.testimonial_videos) : post.testimonial_videos
        };

        return new Response(JSON.stringify({
            success: true,
            post: parsedPost
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get post by ID error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Eroare la citirea postării'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

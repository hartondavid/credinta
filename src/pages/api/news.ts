import type { APIRoute } from 'astro';
import databaseManager from '../../../database.mjs';

// GET - Citirea postărilor pentru știri
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
        const postType = url.searchParams.get('postType'); // 'CONFERINTA', 'PODCAST', etc.
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        // Construiește query-ul pentru știri
        let query = knex('posts')
            .where({
                category: 'news',
                is_published: true
            })
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);

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
            postType: post.post_type,
            url: post.url,
            readButton: post.read_button
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
        console.error('Get news posts error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Eroare la citirea postărilor pentru știri'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';
import databaseManager from '../../../../../database.mjs';
import { getProjectTypeByDate } from '../../../../components/pages/projects/projectUtils';

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

// Get single project post
export const GET: APIRoute = async ({ request, params }) => {
    try {
        const admin = verifyAdminToken(request);
        if (!admin) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Acces neautorizat'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const id = params.id;

        if (!id) {
            return new Response(JSON.stringify({
                success: false,
                error: 'ID-ul postării este obligatoriu'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

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

        // Get project from database
        const project = await knex('posts')
            .select('*')
            .where({ id: id, category: 'project' })
            .first();

        if (!project) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Postarea nu a fost găsită'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Helper function to safely parse JSON
        const safeJsonParse = (value: any, defaultValue: any = []) => {
            if (!value || value === null || value === '') {
                return defaultValue;
            }
            // If it's already an object/array, return it as-is
            if (typeof value === 'object') {
                return value;
            }
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value);
                } catch (error) {
                    console.warn('Failed to parse JSON:', value, error);
                    return defaultValue;
                }
            }
            return value;
        };

        // Parse JSON fields and map to frontend expected format
        const parsedProject = {
            id: project.id,
            title: project.title,
            content: project.content,
            keywords: safeJsonParse(project.keywords, []),
            postType: '',
            eventType: project.event_type,
            isActive: project.is_active,
            showGallery: project.gallery_flag,
            createdAt: project.created_at,
            startDate: project.start_date,
            endDate: project.end_date,
            duration: project.duration,
            cloudinaryIds: safeJsonParse(project.cloudinary_ids, []),
            youtubeVideos: safeJsonParse(project.youtube_videos, []),
            galleryIds: safeJsonParse(project.gallery_image_ids, []),
            testimonialVideos: safeJsonParse(project.testimonial_videos, [])
        };

        return new Response(JSON.stringify(parsedProject), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get project post error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Eroare internă a serverului'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// Update existing project post
export const PUT: APIRoute = async ({ request, params }) => {
    try {
        const admin = verifyAdminToken(request);
        if (!admin) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Acces neautorizat'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const id = params.id;
        const { ...postData } = await request.json();

        if (!id) {
            return new Response(JSON.stringify({
                success: false,
                error: 'ID-ul postării este obligatoriu'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

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

        // Calculate project type automatically based on dates
        const createdAt = postData.createdAt || new Date().toISOString();
        const calculatedProjectType = getProjectTypeByDate(
            createdAt,
            postData.startDate,
            postData.endDate,
            postData.eventType
        );

        // Prepare data for database update
        const updateData = {
            title: postData.title,
            content: postData.content,
            keywords: JSON.stringify(postData.keywords || []),
            post_type: '',
            event_type: postData.eventType,
            is_active: postData.isActive,
            gallery_flag: postData.showGallery,
            start_date: postData.startDate,
            end_date: postData.endDate,
            duration: postData.duration,
            cloudinary_ids: JSON.stringify(postData.cloudinaryIds || []),
            youtube_videos: JSON.stringify(postData.youtubeVideos || []),
            gallery_image_ids: JSON.stringify(postData.galleryIds || []),
            testimonial_videos: JSON.stringify(postData.testimonialVideos || []),
            project_type: calculatedProjectType,
            updated_at: new Date().toISOString()
        };

        // Update project in database
        const updatedRows = await knex('posts')
            .where({ id: id, category: 'project' })
            .update(updateData);

        if (updatedRows === 0) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Postarea nu a fost găsită'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Postarea a fost actualizată cu succes'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Update project post error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Eroare internă a serverului'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// Delete project post
export const DELETE: APIRoute = async ({ request, params }) => {
    try {
        const admin = verifyAdminToken(request);
        if (!admin) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Acces neautorizat'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const id = params.id;

        if (!id) {
            return new Response(JSON.stringify({
                success: false,
                error: 'ID-ul postării este obligatoriu'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

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

        // Delete from database
        const deletedRows = await knex('posts')
            .where({ id: id, category: 'project' })
            .del();

        if (deletedRows === 0) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Postarea nu a fost găsită'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Postarea a fost ștearsă cu succes'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Delete project post error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Eroare internă a serverului'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

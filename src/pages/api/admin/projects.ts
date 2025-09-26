import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';
import databaseManager from '../../../../database.mjs';
import { getProjectTypeByDate } from '../../../components/pages/projects/projectUtils';

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
export const GET: APIRoute = async ({ request }) => {
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

        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();

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

// Add new project post
export const POST: APIRoute = async ({ request }) => {
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

        const postData = await request.json();

        // Validate required fields
        const requiredFields = ['title', 'content'];
        const missingFields = requiredFields.filter(field => !postData[field]);

        if (missingFields.length > 0) {
            return new Response(JSON.stringify({
                success: false,
                error: `Câmpuri obligatorii lipsă: ${missingFields.join(', ')}`
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

        // Prepare data for database
        const postDataForDB = {
            title: postData.title,
            content: postData.content,
            created_at: createdAt,
            keywords: JSON.stringify(postData.keywords || []),
            post_type: '',
            category: 'project',
            project_type: calculatedProjectType, // Use calculated type instead of form value
            event_type: postData.eventType || 'single-day',
            start_date: postData.startDate,
            end_date: postData.endDate,
            duration: postData.duration,
            is_active: postData.isActive || false,
            cloudinary_ids: JSON.stringify(postData.cloudinaryIds || []),
            testimonial_videos: JSON.stringify(postData.testimonialVideos || []),
            youtube_videos: JSON.stringify(postData.youtubeVideos || []),
            gallery_flag: Boolean(postData.showGallery),
            gallery_image_ids: JSON.stringify(postData.galleryIds || []),
            is_published: true
        };

        // Save to database
        const [insertedPost] = await knex('posts').insert(postDataForDB).returning('*');

        return new Response(JSON.stringify({
            success: true,
            post: insertedPost,
            message: 'Postarea pentru proiecte a fost adăugată cu succes'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Add project post error:', error);
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
export const PUT: APIRoute = async ({ request }) => {
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

        const { id, ...postData } = await request.json();

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
            created_at: createdAt,
            keywords: JSON.stringify(postData.keywords || []),
            post_type: '',
            project_type: calculatedProjectType, // Use calculated type
            event_type: postData.eventType || 'single-day',
            start_date: postData.startDate,
            end_date: postData.endDate,
            duration: postData.duration,
            is_active: postData.isActive || false,
            cloudinary_ids: JSON.stringify(postData.cloudinaryIds || []),
            testimonial_videos: JSON.stringify(postData.testimonialVideos || []),
            youtube_videos: JSON.stringify(postData.youtubeVideos || []),
            gallery_flag: Boolean(postData.showGallery),
            gallery_image_ids: JSON.stringify(postData.galleryIds || []),
            updated_at: new Date().toISOString()
        };

        // Update in database
        const updatedRows = await knex('posts')
            .where({ id: id })
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
export const DELETE: APIRoute = async ({ request }) => {
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

        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();

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

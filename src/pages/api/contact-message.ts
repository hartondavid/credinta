import type { APIRoute } from 'astro';
import databaseManager from '../../../database.mjs';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { first_name, last_name, email, phone, text_area } = body;

        // Validate required fields
        if (!first_name || !last_name || !email || !phone || !text_area) {
            return new Response(
                JSON.stringify({
                    ok: false,
                    error: 'All fields are required: first_name, last_name, email, phone, text_area'
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // Get database connection
        const db = await databaseManager.getKnex();

        if (!db) {
            throw new Error('Database connection failed');
        }

        // Insert the contact message
        const [newMessage]: any = await db('contact_messages')
            .insert({
                first_name,
                last_name,
                email,
                phone,
                text_area,
                created_at: new Date(),
                updated_at: new Date()
            })
            .returning('*');

        return new Response(
            JSON.stringify({
                ok: true,
                message: 'Contact message stored successfully',
                data: {
                    id: newMessage.id,
                    first_name: newMessage.first_name,
                    last_name: newMessage.last_name,
                    email: newMessage.email,
                    phone: newMessage.phone,
                    text_area: newMessage.text_area,
                    created_at: newMessage.created_at,
                    updated_at: newMessage.updated_at
                }
            }),
            {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

    } catch (error: any) {
        console.error('Error storing contact message:', error);

        // Handle unique constraint violations
        if (error.code === '23505') { // PostgreSQL unique constraint violation
            if (error.constraint?.includes('email')) {
                return new Response(
                    JSON.stringify({
                        ok: false,
                        error: 'A message with this email already exists'
                    }),
                    {
                        status: 409,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }
            if (error.constraint?.includes('phone')) {
                return new Response(
                    JSON.stringify({
                        ok: false,
                        error: 'A message with this phone number already exists'
                    }),
                    {
                        status: 409,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }
        }

        return new Response(
            JSON.stringify({
                ok: false,
                error: 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};

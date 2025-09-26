import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import databaseManager from '../../../../database.mjs';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Username și parola sunt obligatorii'
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

        // Debug: Check if table exists
        try {
            const tableExists = await knex.schema.hasTable('admins');
            console.log('Table "admins" exists:', tableExists);

            if (!tableExists) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Tabela admins nu există'
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } catch (error) {
            console.error('Error checking table:', error);
        }

        // Find admin by username
        const admin = await knex('admins')
            .where({ username, is_active: true })
            .first();

        console.log('Login attempt:', {
            username,
            adminFound: !!admin,
            adminData: admin ? {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                is_active: admin.is_active,
                password_hash_length: admin.password_hash?.length
            } : null
        });

        if (!admin) {
            console.log('Admin not found or inactive');
            return new Response(JSON.stringify({
                success: false,
                error: 'Credențiale invalide'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verify password
        console.log('Password verification:', {
            passwordLength: password?.length,
            hashLength: admin.password_hash?.length,
            hashStart: admin.password_hash?.substring(0, 10) + '...'
        });

        const isValidPassword = await bcrypt.compare(password, admin.password_hash);
        console.log('Password valid:', isValidPassword);

        if (!isValidPassword) {
            console.log('Invalid password');
            return new Response(JSON.stringify({
                success: false,
                error: 'Credențiale invalide'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                adminId: admin.id,
                username: admin.username,
                role: 'admin'
            },
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: '24h' }
        );

        return new Response(JSON.stringify({
            success: true,
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                fullName: admin.full_name
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Login error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Eroare internă a serverului'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

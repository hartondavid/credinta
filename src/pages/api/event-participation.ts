import type { APIRoute } from 'astro';
import databaseManager from '../../../database.mjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Helper function to check if user can participate in an event
async function canUserParticipateInEvent(eventId: string, email: string): Promise<{ canParticipate: boolean; reason?: string; participant?: any }> {
    try {
        const knex = await databaseManager.getKnex();
        const existingParticipant = await (knex as any)('event_participants')
            .where('event_id', eventId)
            .where('email', email)
            .first();

        if (!existingParticipant) {
            return { canParticipate: true };
        }

        if (existingParticipant.email_confirmed) {
            return {
                canParticipate: false,
                reason: 'Ești deja înregistrat și confirmat pentru acest eveniment.',
                participant: existingParticipant
            };
        }

        // Check if confirmation token is expired
        if (existingParticipant.expires_at && new Date() > new Date(existingParticipant.expires_at)) {
            // Token expired, allow re-registration
            return { canParticipate: true };
        }

        return {
            canParticipate: false,
            reason: 'Ai deja o înscriere în așteptare. Verifică email-ul pentru confirmare.',
            participant: existingParticipant
        };
    } catch (error) {
        console.error('Error checking if user can participate:', error);
        return { canParticipate: false, reason: 'Eroare la verificarea statusului participării.' };
    }
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const { eventId, firstName, lastName, email } = await request.json();

        // Validate input
        if (!eventId || !firstName || !lastName || !email) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Toate câmpurile sunt obligatorii'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Check if user can participate
        const participationCheck = await canUserParticipateInEvent(eventId, email);

        if (!participationCheck.canParticipate) {
            return new Response(JSON.stringify({
                success: false,
                error: participationCheck.reason || 'Nu poți participa la acest eveniment'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // If user has an expired registration, delete it first
        if (participationCheck.participant && participationCheck.participant.expires_at && new Date() > new Date(participationCheck.participant.expires_at)) {
            const knex = await databaseManager.getKnex();
            await (knex as any)('event_participants')
                .where('id', participationCheck.participant.id)
                .del();
        }

        // Generate confirmation token
        const confirmationToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Save participant to database
        const knex = await databaseManager.getKnex();
        const [participant] = await (knex as any)('event_participants').insert({
            event_id: eventId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            confirmation_token: confirmationToken,
            expires_at: expiresAt
        }).returning('*');

        // Get event details from projectPosts
        const { getMappedFutureProjects } = await import('../../components/pages/projects/projectPosts');
        const futureProjects = getMappedFutureProjects();
        const event = futureProjects.find((project: any) => project.id === eventId);

        if (!event) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Evenimentul nu a fost găsit'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Send confirmation email to participant
        const confirmationUrl = `${process.env.SITE_URL}/confirm-participation?token=${confirmationToken}`;

        const participantEmailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmă participarea la eveniment</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://res.cloudinary.com/demo/image/upload/v1/logo" alt="Calarași Warriors" style="max-width: 200px; height: auto;">
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin-bottom: 20px; text-align: center;">🎉 Confirmă participarea la eveniment!</h1>
                    
                    <p style="font-size: 18px; margin-bottom: 20px;">Salut ${firstName} ${lastName}!</p>
                    
                    <p style="margin-bottom: 20px;">Te-ai înscris cu succes la evenimentul:</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
                        <h2 style="color: #2c3e50; margin-bottom: 10px;">${event.title}</h2>
                        <p style="color: #7f8c8d; margin-bottom: 5px;">📅 ${event.plannedDate}</p>
                        <p style="color: #7f8c8d;">📍 Status: ${event.status}</p>
                    </div>
                    
                    <p style="margin-bottom: 30px;">Pentru a confirma participarea, apasă butonul de mai jos:</p>
                    
                    <a href="${confirmationUrl}" style="display: inline-block; background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        ✅ Confirmă participarea
                    </a>
                    
                    <p style="margin-top: 20px; font-size: 14px; color: #7f8c8d;">
                        Acest link expiră în 24 de ore.
                    </p>
                </div>
                
                <div style="text-align: center; color: #7f8c8d; font-size: 14px;">
                    <p>Dacă nu ai solicitat această înscriere, poți ignora acest email.</p>
                    <p>Calarași Warriors - Comunitatea ta de motocicliști!</p>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"Calarași Warriors" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Confirmă participarea la ${event.title}`,
            html: participantEmailHtml
        });

        // Send notification email to admin
        const adminEmailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Nouă participare la eveniment</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://res.cloudinary.com/demo/image/upload/v1/logo" alt="Calarași Warriors" style="max-width: 200px; height: auto;">
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
                    <h1 style="color: #2c3e50; margin-bottom: 20px;">🎯 Nouă participare la eveniment!</h1>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c;">
                        <h2 style="color: #2c3e50; margin-bottom: 15px;">${event.title}</h2>
                        <p style="color: #7f8c8d; margin-bottom: 5px;">📅 ${event.plannedDate}</p>
                        <p style="color: #7f8c8d;">📍 Status: ${event.status}</p>
                    </div>
                    
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">Participant:</h3>
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin-bottom: 10px;"><strong>Nume:</strong> ${firstName} ${lastName}</p>
                        <p style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
                        <p style="margin-bottom: 10px;"><strong>Data înscrierii:</strong> ${new Date().toLocaleDateString('ro-RO')}</p>
                    </div>
                    
                    <p style="color: #7f8c8d; font-size: 14px;">
                        Participantul va primi un email de confirmare și va trebui să confirme participarea.
                    </p>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"Calarași Warriors" <${process.env.SMTP_USER}>`,
            to: process.env.EMAIL_TO || 'admin@credinta.live',
            subject: `Nouă participare la ${event.title}`,
            html: adminEmailHtml
        });

        return new Response(JSON.stringify({
            success: true,
            message: 'Participarea a fost înregistrată cu succes! Verifică email-ul pentru confirmare.',
            participantId: participant.id
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Event participation error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'A apărut o eroare la înregistrarea participării'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

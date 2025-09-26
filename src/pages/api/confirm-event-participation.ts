import type { APIRoute } from 'astro';
import databaseManager from '../../../database.mjs';
import nodemailer from 'nodemailer';

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

export const GET: APIRoute = async ({ url }) => {
    try {
        const token = url.searchParams.get('token');

        if (!token) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Token-ul de confirmare lipsește!'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Find participant by token
        const knex = await databaseManager.getKnex();
        const [participant] = await (knex as any)('event_participants')
            .where('confirmation_token', token)
            .where('expires_at', '>', new Date())
            .select('*');

        if (!participant) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Link-ul de confirmare a expirat sau nu este valid!'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Check if already confirmed
        if (participant.email_confirmed) {
            return new Response(JSON.stringify({
                success: false,
                alreadyConfirmed: true,
                message: 'Participarea ta a fost deja confirmată!'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get event details from projectPosts instead of database
        const { getMappedFutureProjects } = await import('../../components/pages/projects/projectPosts');
        const futureProjects = getMappedFutureProjects();
        const event = futureProjects.find((project: any) => project.id === participant.event_id);
        if (!event) {
            throw new Error('Evenimentul nu a fost găsit');
        }

        // Confirm participation
        await (knex as any)('event_participants')
            .where('id', participant.id)
            .update({
                email_confirmed: true,
                confirmed_at: new Date(),
                confirmation_token: null
            });

        // Send success email to participant
        const successEmailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Participare confirmată - Calarași Warriors</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://res.cloudinary.com/demo/image/upload/v1/logo" alt="Calarași Warriors" style="max-width: 200px; height: auto;">
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                    <h1 style="color: #27ae60; margin-bottom: 20px; text-align: center;">🎉 Participarea ta a fost confirmată!</h1>
                    
                    <p style="font-size: 18px; margin-bottom: 20px;">Salut ${participant.first_name} ${participant.last_name}!</p>
                    
                    <p style="margin-bottom: 20px;">Participarea ta la evenimentul următor a fost confirmată cu succes:</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
                        <h2 style="color: #2c3e50; margin-bottom: 10px;">${event.title}</h2>
                        <p style="color: #7f8c8d; margin-bottom: 5px;">📅 ${event.plannedDate}</p>
                        <p style="color: #7f8c8d;">📍 Status: ${event.status}</p>
                    </div>
                    
                    <p style="margin-bottom: 20px;">Te așteptăm cu drag la eveniment!</p>
                    
                    <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #27ae60;">
                        <h3 style="color: #27ae60; margin-bottom: 10px;">📋 Informații importante:</h3>
                        <ul style="text-align: left; color: #2c3e50;">
                            <li>Asigură-te că ai toate echipamentele necesare</li>
                            <li>Ajunge cu 15 minute înainte de începerea evenimentului</li>
                            <li>Respectă regulamentul și instrucțiunile organizatorilor</li>
                        </ul>
                    </div>
                </div>
                
                <div style="text-align: center; color: #7f8c8d; font-size: 14px;">
                    <p>Calarași Warriors - Comunitatea ta de motocicliști!</p>
                    <p>Pentru întrebări, ne poți contacta la: ${process.env.EMAIL_TO || 'contact@credinta.live'}</p>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"Calarași Warriors" <${process.env.SMTP_USER}>`,
            to: participant.email,
            subject: `Participare confirmată la ${event.title}`,
            html: successEmailHtml
        });

        // Send notification to admin about confirmation
        const adminNotificationHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Participare confirmată - Calarași Warriors</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://res.cloudinary.com/demo/image/upload/v1/logo" alt="Calarași Warriors" style="max-width: 200px; height: auto;">
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
                    <h1 style="color: #27ae60; margin-bottom: 20px;">✅ Participare confirmată!</h1>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
                        <h2 style="color: #2c3e50; margin-bottom: 10px;">${event.title}</h2>
                        <p style="color: #7f8c8d; margin-bottom: 5px;">📅 ${event.plannedDate}</p>
                        <p style="color: #7f8c8d;">📍 Status: ${event.status}</p>
                    </div>
                    
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">Participant confirmat:</h3>
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin-bottom: 10px;"><strong>Nume:</strong> ${participant.first_name} ${participant.last_name}</p>
                        <p style="margin-bottom: 10px;"><strong>Email:</strong> ${participant.email}</p>
                        <p style="margin-bottom: 10px;"><strong>Data confirmării:</strong> ${new Date().toLocaleDateString('ro-RO')}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"Calarași Warriors" <${process.env.SMTP_USER}>`,
            to: process.env.EMAIL_TO || 'admin@credinta.live',
            subject: `Participare confirmată la ${event.title}`,
            html: adminNotificationHtml
        });

        // Return success response as JSON
        return new Response(JSON.stringify({
            success: true,
            message: 'Participarea a fost confirmată cu succes!',
            event: {
                title: event.title,
                plannedDate: event.plannedDate,
                status: event.status
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Event participation confirmation error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: 'A apărut o eroare la confirmarea participării. Încearcă din nou sau contactează-ne.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

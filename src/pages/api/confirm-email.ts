import type { APIRoute } from 'astro';

export const prerender = false;

// In a real application, you'd store this in a database
// For now, we'll use a simple in-memory store (this will reset on server restart)
const pendingConfirmations = new Map<string, {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    details: string;
    expiresAt: number;
}>();

export const POST: APIRoute = async ({ request }) => {
    try {
        const contentType = request.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            return new Response(
                JSON.stringify({ ok: false, error: 'Content-Type must be application/json' }),
                { status: 415, headers: { 'content-type': 'application/json' } }
            );
        }

        const body = await request.json();
        const { email, firstName, lastName, phone, details } = body;

        if (!email || !firstName || !lastName) {
            return new Response(
                JSON.stringify({ ok: false, error: 'Email, firstName, and lastName are required' }),
                { status: 400, headers: { 'content-type': 'application/json' } }
            );
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({
                    ok: false,
                    error: 'Formatul adresei de email este invalid'
                }),
                { status: 400, headers: { 'content-type': 'application/json' } }
            );
        }

        // Email validation passed - proceed with sending confirmation

        // Generate a unique confirmation token
        const token = crypto.randomUUID();
        const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days from now

        console.log('Token generated:', token);
        console.log('Current time:', new Date().toISOString());
        console.log('Expires at:', new Date(expiresAt).toISOString());
        console.log('Time difference (hours):', (expiresAt - Date.now()) / (1000 * 60 * 60));

        // Store the confirmation data
        pendingConfirmations.set(token, {
            email,
            firstName,
            lastName,
            phone,
            details,
            expiresAt
        });

        // Send confirmation email
        const SMTP_HOST = import.meta.env.SMTP_HOST as string | undefined;
        const SMTP_PORT = Number(import.meta.env.SMTP_PORT || 587);
        const SMTP_USER = import.meta.env.SMTP_USER as string | undefined;
        const SMTP_PASS = import.meta.env.SMTP_PASS as string | undefined;
        const EMAIL_TO = import.meta.env.EMAIL_TO as string | undefined;

        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_TO) {
            return new Response(
                JSON.stringify({
                    ok: false,
                    error: 'Config lipsă: setează SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_TO în .env.local',
                }),
                { status: 400, headers: { 'content-type': 'application/json' } }
            );
        }

        const { default: nodemailer } = await import('nodemailer');
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465,
            auth: { user: SMTP_USER, pass: SMTP_PASS },
        });

        const confirmationUrl = `${import.meta.env.SITE_URL || 'http://localhost:4321'}/confirm-email?token=${token}`;

        const subject = 'Confirmă adresa ta de email - Biserica Credința';
        const html = `
            <!DOCTYPE html>
            <html lang="ro">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmă Email-ul - Biserica Credința</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header cu logo -->
                    <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px 20px; text-align: center;">
                       
                            <img src="https://res.cloudinary.com/drtkpapql/image/upload/w_300,h_300,c_fill,q_auto,f_auto/credinta_logo_tps1xb" alt="Biserica Credința Logo" style="width: 150px; height: 150px; object-fit: contain; display: block; margin: 0 auto;">
                       
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                            Biserica Credința
                        </h1>
                        <p style="color:#ffffff; margin: 10px 0 0 0; font-size: 16px; font-weight: 300;">
                            Suntem o comunitate vie de creștini care Îl urmează pe Hristos
                        </p>
                    </div>

                    <!-- Conținut principal -->
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                           
                            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                                Bună ${firstName}!
                            </h2>
                            <p style="color: #64748b; margin: 0; font-size: 16px; line-height: 1.6;">
                                Mulțumim că ai completat formularul de contact pe site-ul nostru.
                            </p>
                        </div>

                        <div style="background-color: #f8fafc; border-left: 4px solid #305c76; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                            <p style="color: #475569; margin: 0; font-size: 16px; line-height: 1.6; font-weight: 500;">
                                Pentru a finaliza procesul și a ne permite să îți răspundem, te rugăm să confirmi adresa ta de email prin accesarea butonului de mai jos:
                            </p>
                        </div>

                        <!-- Buton de confirmare -->
                        <div style="text-align: center; margin: 40px 0;">
                    <a href="${confirmationUrl}" 
                               style="background: linear-gradient(135deg, #305c76 0%, #305c76 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;">
                        Confirmă Email-ul
                    </a>
                </div>
                
                        <!-- Link alternativ -->
                        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 30px 0;">
                            <p style="color: #64748b; margin: 0 0 15px 0; font-size: 14px; font-weight: 500;">
                                Dacă butonul nu funcționează, poți copia și lipi următorul link în browser:
                            </p>
                            <p style="word-break: break-all; color: #475569; margin: 0; font-size: 14px; background-color: #ffffff; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">
                                ${confirmationUrl}
                            </p>
                        </div>

                        <!-- Informații importante -->
                        <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px;">
                                    <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#92400e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <strong style="color: #92400e; font-size: 16px;">Informații importante</strong>
                            </div>
                            <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                                <li>Acest link expiră în <strong>24 de ore</strong></li>
                                <li>Dacă nu ai completat tu formularul, poți ignora acest email</li>
                                <li>Vom reveni cu un răspuns în cel mai scurt timp</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #1e293b; padding: 30px 20px; text-align: center; border-radius: 0 0 8px 8px;">
                        <div style="margin-bottom: 20px; text-align: center;">
                            <img src="https://res.cloudinary.com/drtkpapql/image/upload/w_300,h_300,c_fill,q_auto,f_auto/credinta_logo_tps1xb" alt="Biserica Credința" style="width: 150px; height: 150px; object-fit: contain; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
                        </div>
                        <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                            Biserica Credința
                        </p>
                        <p style="color: #ffffff; margin: 0; font-size: 14px;">
                    Suntem o comunitate vie de creștini care Îl urmează pe Hristos
                </p>
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #334155;">
                            <p style="color: #ffffff; margin: 0; font-size: 12px;">
                                © ${new Date().getFullYear()} Biserica Credința. Toate drepturile rezervate.
                            </p>
                        </div>
                    </div>
            </div>
            </body>
            </html>
        `;

        const text = `
            ========================================
            BISERICA CREDINȚA - CONFIRMARE EMAIL
            ========================================

            Bună ${firstName}!
            
            Mulțumim că ai completat formularul de contact pe site-ul nostru.
            
            Pentru a finaliza procesul și a ne permite să îți răspundem, te rugăm să confirmi adresa ta de email prin accesarea următorului link:
            
            ${confirmationUrl}
            
            ========================================
            INFORMAȚII IMPORTANTE:
            ========================================
            • Acest link expiră în 24 de ore
            • Dacă nu ai completat tu formularul, poți ignora acest email
            • Vom reveni cu un răspuns în cel mai scurt timp

            ========================================
            CONTACT:
            ========================================
            Biserica Credința
            Bulevardul Voluntari nr. 61A, Voluntari, Ilfov
            Email: bisericacredintavoluntari@gmail.com
            Telefon: +40788980747

            ========================================
            © ${new Date().getFullYear()} Biserica Credința
            Toate drepturile rezervate.
            ========================================
        `;

        await transporter.sendMail({
            from: SMTP_USER,
            to: email,
            subject,
            text,
            html,
        });

        return new Response(JSON.stringify({
            ok: true,
            message: 'Email de confirmare trimis cu succes'
        }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });

    } catch (error: any) {
        console.error('confirm-email error', error);
        const details = error?.message || String(error);

        // Handle specific email delivery errors
        let userFriendlyError = 'A apărut o eroare la trimiterea email-ului de confirmare.';

        if (details.includes('Recipient inbox full') || details.includes('inbox is full')) {
            userFriendlyError = 'Cutia poștală a destinatarului este plină. Încearcă din nou mai târziu.';
        } else if (details.includes('550') && details.includes('does not exist')) {
            userFriendlyError = 'Adresa de email nu există. Verifică și corectează adresa.';
        } else if (details.includes('550') && details.includes('User unknown')) {
            userFriendlyError = 'Utilizatorul nu există la această adresă de email.';
        } else if (details.includes('550') && details.includes('Invalid recipient')) {
            userFriendlyError = 'Adresa de email este invalidă.';
        } else if (details.includes('550') && details.includes('Mailbox not found')) {
            userFriendlyError = 'Cutia poștală nu a fost găsită.';
        } else if (details.includes('553') && details.includes('relay not permitted')) {
            userFriendlyError = 'Eroare de configurare SMTP. Contactează administratorul.';
        } else if (details.includes('Authentication failed')) {
            userFriendlyError = 'Eroare de autentificare SMTP. Contactează administratorul.';
        }

        return new Response(JSON.stringify({
            ok: false,
            error: userFriendlyError,
            errorDetails: details
        }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
};

export const GET: APIRoute = async ({ url }) => {
    try {
        const token = url.searchParams.get('token');

        if (!token) {
            return new Response(
                JSON.stringify({ ok: false, error: 'Token lipsă' }),
                { status: 400, headers: { 'content-type': 'application/json' } }
            );
        }

        const confirmation = pendingConfirmations.get(token);

        if (!confirmation) {
            return new Response(
                JSON.stringify({ ok: false, error: 'Token invalid sau expirat' }),
                { status: 400, headers: { 'content-type': 'application/json' } }
            );
        }

        if (Date.now() > confirmation.expiresAt) {
            pendingConfirmations.delete(token);
            return new Response(
                JSON.stringify({ ok: false, error: 'Token expirat' }),
                { status: 400, headers: { 'content-type': 'application/json' } }
            );
        }

        // Remove the confirmation from pending list
        pendingConfirmations.delete(token);

        // Store contact message in database
        try {
            const { default: databaseManager } = await import('../../../database.mjs');
            const db = await databaseManager.getKnex();

            if (db) {
                await db('contact_messages').insert({
                    first_name: confirmation.firstName,
                    last_name: confirmation.lastName,
                    email: confirmation.email,
                    phone: confirmation.phone,
                    text_area: confirmation.details,
                    created_at: new Date(),
                    updated_at: new Date()
                });
                console.log('Contact message stored in database successfully');
            } else {
                console.error('Database connection failed');
            }
        } catch (dbError: any) {
            console.error('Database error:', dbError);

            // Handle specific database errors
            if (dbError.code === '23505') { // Unique constraint violation
                if (dbError.constraint === 'contact_messages_email_unique') {
                    return new Response(JSON.stringify({
                        ok: false,
                        error: 'Această adresă de email a fost deja folosită'
                    }), {
                        status: 400,
                        headers: { 'content-type': 'application/json' }
                    });
                } else if (dbError.constraint === 'contact_messages_phone_unique') {
                    return new Response(JSON.stringify({
                        ok: false,
                        error: 'Acest număr de telefon a fost deja folosit'
                    }), {
                        status: 400,
                        headers: { 'content-type': 'application/json' }
                    });
                }
            }

            return new Response(JSON.stringify({
                ok: false,
                error: 'Eroare la salvarea în baza de date'
            }), {
                status: 500,
                headers: { 'content-type': 'application/json' }
            });
        }

        // Send the actual contact form email
        const SMTP_HOST = import.meta.env.SMTP_HOST as string | undefined;
        const SMTP_PORT = Number(import.meta.env.SMTP_PORT || 587);
        const SMTP_USER = import.meta.env.SMTP_USER as string | undefined;
        const SMTP_PASS = import.meta.env.SMTP_PASS as string | undefined;
        const EMAIL_TO = import.meta.env.EMAIL_TO as string | undefined;

        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_TO) {
            return new Response(
                JSON.stringify({
                    ok: false,
                    error: 'Config lipsă: setează SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_TO în .env.local',
                }),
                { status: 400, headers: { 'content-type': 'application/json' } }
            );
        }

        const { default: nodemailer } = await import('nodemailer');
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465,
            auth: { user: SMTP_USER, pass: SMTP_PASS },
        });

        const subject = `Contact formular confirmat: ${confirmation.firstName} ${confirmation.lastName}`.trim();
        const text = [
            'Mesaj nou din formularul de contact (EMAIL CONFIRMAT):',
            `Nume: ${confirmation.firstName} ${confirmation.lastName}`.trim(),
            `Email: ${confirmation.email}`,
            `Telefon: ${confirmation.phone}`,
            `Detalii: ${confirmation.details}`,
        ].join('\n');

        const html = `
            <!DOCTYPE html>
            <html lang="ro">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mesaj nou de contact - Biserica Credința</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header cu logo -->
                    <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px 20px; text-align: center;">
                       
                            <img src="https://res.cloudinary.com/drtkpapql/image/upload/w_300,h_300,c_fill,q_auto,f_auto/credinta_logo_tps1xb" alt="Biserica Credința Logo" style="width: 150px; height: 150px; object-fit: contain; display: block; margin: 0 auto;">
                       
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                            Biserica Credința
                        </h1>
                        <p style="color: #cbd5e1; margin: 10px 0 0 0; font-size: 16px; font-weight: 300;">
                            Suntem o comunitate vie de creștini care Îl urmează pe Hristos
                        </p>
                    </div>

                    <!-- Conținut principal -->
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                                Mesaj nou de contact
                            </h2>
                            <p style="color: #64748b; margin: 0; font-size: 16px; line-height: 1.6;">
                                Ai primit un nou mesaj prin formularul de contact (EMAIL CONFIRMAT)
                            </p>
                        </div>

                        <!-- Detalii contact -->
                        <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                            <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px;">
                                    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#fbbf24" stroke-width="2"/>
                                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#fbbf24" stroke-width="2"/>
                                </svg>
                                Informații contact
                            </h3>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                <div>
                                    <p style="color: #64748b; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                                        Nume complet
                                    </p>
                                    <p style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 600; background-color: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                                        ${confirmation.firstName} ${confirmation.lastName}
                                    </p>
                                </div>
                                <div>
                                    <p style="color: #64748b; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                                        Telefon
                                    </p>
                                    <p style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 600; background-color: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                                        ${confirmation.phone}
                                    </p>
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <p style="color: #64748b; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                                    Email
                                </p>
                                <p style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 600; background-color: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                                    ${confirmation.email}
                                </p>
                            </div>
                        </div>

                        <!-- Mesajul -->
                        <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 25px; margin: 30px 0;">
                            <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px;">
                                    <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#92400e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Mesajul
                            </h3>
                            <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #fbbf24;">
                                <p style="color: #1e293b; margin: 0; font-size: 16px; line-height: 1.6;">
                                    ${confirmation.details}
                                </p>
                            </div>
                        </div>

                       
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #1e293b; padding: 30px 20px; text-align: center; border-radius: 0 0 8px 8px;">
                        <div style="margin-bottom: 20px; text-align: center;">
                            <img src="https://res.cloudinary.com/drtkpapql/image/upload/w_300,h_300,c_fill,q_auto,f_auto/credinta_logo_tps1xb" alt="Biserica Credința" style="width: 150px; height: 150px; object-fit: contain; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
                        </div>
                        <p style="color: #cbd5e1; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                            Biserica Credința
                        </p>
                        <p style="color: #94a3b8; margin: 0; font-size: 14px;">
                            Suntem o comunitate vie de creștini care Îl urmează pe Hristos
                        </p>
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #334155;">
                            <p style="color: #64748b; margin: 0; font-size: 12px;">
                                © ${new Date().getFullYear()} Biserica Credința. Toate drepturile rezervate.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: SMTP_USER,
            to: confirmation.email,
            cc: EMAIL_TO,
            subject,
            text,
            html,
            replyTo: confirmation.email,
        });

        return new Response(JSON.stringify({
            ok: true,
            message: 'Email confirmat cu succes, mesajul a fost salvat în baza de date și trimis'
        }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });

    } catch (error: any) {
        console.error('confirm-email GET error', error);
        const details = error?.message || String(error);
        return new Response(JSON.stringify({
            ok: false,
            error: 'Failed to confirm email',
            errorDetails: details
        }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
};

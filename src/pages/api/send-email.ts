import type { APIRoute } from 'astro';

export const prerender = false;

function isValidEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    return /.+@.+\..+/.test(email);
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const contentType = request.headers.get('content-type') || '';
        if (
            !contentType.includes('multipart/form-data') &&
            !contentType.includes('application/x-www-form-urlencoded')
        ) {
            return new Response(
                JSON.stringify({ ok: false, error: 'Content-Type invalid' }),
                { status: 415, headers: { 'content-type': 'application/json' } }
            );
        }

        const form = await request.formData();
        const firstName = (form.get('hs-firstname-contacts') || '').toString();
        const lastName = (form.get('hs-lastname-contacts') || '').toString();
        const email = (form.get('hs-email-contacts') || '').toString();
        const phone = (form.get('hs-phone-number') || '').toString();
        const details = (form.get('hs-about-contacts') || '').toString();

        const SMTP_HOST = import.meta.env.SMTP_HOST as string | undefined;
        const SMTP_PORT = Number(import.meta.env.SMTP_PORT || 587);
        const SMTP_USER = import.meta.env.SMTP_USER as string | undefined;
        const SMTP_PASS = import.meta.env.SMTP_PASS as string | undefined;
        const EMAIL_TO = import.meta.env.EMAIL_TO as string | undefined;

        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_TO) {
            return new Response(
                JSON.stringify({
                    ok: false,
                    error:
                        'Config lipsă: setează SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_TO (și opțional SMTP_PORT) în .env.local',
                }),
                { status: 400, headers: { 'content-type': 'application/json' } }
            );
        }

        const subject = `Contact formular: ${firstName} ${lastName}`.trim();
        const text = [
            '========================================',
            'CĂLĂRAȘI WARRIORS - MESAJ NOU DE CONTACT',
            '========================================',
            '',
            'Ai primit un nou mesaj prin formularul de contact.',
            '',
            '========================================',
            'INFORMAȚII CONTACT:',
            '========================================',
            `Nume complet: ${firstName} ${lastName}`.trim(),
            `Email: ${email}`,
            `Telefon: ${phone}`,
            '',
            '========================================',
            'MESAJUL:',
            '========================================',
            details,
            '',
            '========================================',
            'ACȚIUNI RECOMANDATE:',
            '========================================',
            `• Răspunde direct la: ${email}`,
            `• Sună la: ${phone}`,
            '',
            '========================================',
            'CONTACT:',
            '========================================',
            'Călărași Warriors',
            'Club Sportiv Călărași Warriors',
            'Email: cscalarasiwarriors@gmail.com',
            'Telefon: +40732916591',
            '',
            '========================================',
            `© ${new Date().getFullYear()} Călărași Warriors`,
            'Toate drepturile rezervate.',
            '========================================'
        ].join('\n');

        const html = `
            <!DOCTYPE html>
            <html lang="ro">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mesaj nou de contact - Călărași Warriors</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header cu logo -->
                    <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px 20px; text-align: center;">
                        <img src="https://res.cloudinary.com/drtkpapql/image/upload/w_800,h_600,c_fill,q_auto/calarasi_warriors_logo_ws33uj" alt="Călărași Warriors Logo" style="width: 150px; height: 150px; object-fit: contain; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                            Călărași Warriors
                        </h1>
                        <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; font-weight: 300;">
                            Club Sportiv Călărași Warriors
                        </p>
                    </div>

                    <!-- Conținut principal -->
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                           
                            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                                Mesaj nou de contact
                            </h2>
                            <p style="color: #64748b; margin: 0; font-size: 16px; line-height: 1.6;">
                                Ai primit un nou mesaj prin formularul de contact
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
                                        ${firstName} ${lastName}
                                    </p>
                                </div>
                                <div>
                                    <p style="color: #64748b; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                                        Telefon
                                    </p>
                                    <p style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 600; background-color: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                                        ${phone}
                                    </p>
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <p style="color: #64748b; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                                    Email
                                </p>
                                <p style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 600; background-color: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                                    ${email}
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
                                <p style="color: #1e293b; margin: 0; font-size: 16px; line-height: 1.6; white-space: pre-line;">
                                    ${details}
                                </p>
                            </div>
                        </div>

                        <!-- Acțiuni -->
                        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center;">
                            <h3 style="color: #475569; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                                Acțiuni recomandate
                            </h3>
                            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                                <a href="mailto:${email}" 
                                   style="background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">
                                    Răspunde direct
                                </a>
                                <a href="tel:${phone}" 
                                   style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">
                                    Sună
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #1e293b; padding: 30px 20px; text-align: center; border-radius: 0 0 8px 8px;">
                        <div style="margin-bottom: 20px; text-align: center;">
                            <img src="https://res.cloudinary.com/drtkpapql/image/upload/w_800,h_600,c_fill,q_auto/calarasi_warriors_logo_ws33uj" alt="Călărași Warriors" style="width: 60px; height: 60px; object-fit: contain; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
                        </div>
                        <p style="color: #cbd5e1; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                            Călărași Warriors
                        </p>
                        <p style="color: #94a3b8; margin: 0; font-size: 14px;">
                            Club Sportiv Călărași Warriors
                        </p>
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #334155;">
                            <p style="color: #64748b; margin: 0; font-size: 12px;">
                                © ${new Date().getFullYear()} Călărași Warriors. Toate drepturile rezervate.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
    `;

        const { default: nodemailer } = await import('nodemailer');
        console.log('SMTP_HOST', SMTP_HOST);
        console.log('SMTP_PORT', SMTP_PORT);
        console.log('SMTP_USER', SMTP_USER);
        console.log('SMTP_PASS', SMTP_PASS);
        console.log('To (user email)', email);
        console.log('CC (backup)', EMAIL_TO);
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465,
            auth: { user: SMTP_USER, pass: SMTP_PASS },
        });

        await transporter.sendMail({
            from: SMTP_USER, // Gmail nu permite from diferit de contul autentificat
            to: email, // Email-ul din formular (ex: elena@gmail.com)
            cc: EMAIL_TO, // Copie la contul principal pentru backup
            subject,
            text,
            html,
            replyTo: email, // Răspunsurile vor merge la utilizator
        });

        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    } catch (error: any) {
        console.error('send-email error', error);
        const details = error?.message || String(error);
        return new Response(JSON.stringify({ ok: false, error: 'Failed to send email', errorDetails: details }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
};



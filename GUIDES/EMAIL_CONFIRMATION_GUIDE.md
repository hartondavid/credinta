# Email Confirmation System Guide

## Overview

The email confirmation system adds an extra layer of security to the contact form by requiring users to confirm their email address before their message is actually sent to the administrators.

## How It Works

### 1. User Submits Contact Form
- User fills out the contact form with their information
- Form data is sent to `/api/confirm-email` endpoint
- A unique confirmation token is generated and stored temporarily

### 2. Confirmation Email Sent
- A confirmation email is sent to the user's email address
- Email contains a link with the confirmation token
- Token expires after 24 hours for security

### 3. User Confirms Email
- User clicks the confirmation link in their email
- Link takes them to `/confirm-email?token=TOKEN`
- Token is validated and the actual contact message is sent
- User sees a success message

## Files Created/Modified

### New Files
- `src/pages/api/confirm-email.ts` - API endpoint for email confirmation
- `src/pages/confirm-email.astro` - English confirmation page
- `src/pages/fr/confirm-email.astro` - French confirmation page
- `EMAIL_CONFIRMATION_GUIDE.md` - This documentation

### Modified Files
- `src/components/sections/misc/ContactSection.astro` - Updated to use confirmation flow
- `src/components/sections/fr/ContactSection_fr.astro` - Updated to use confirmation flow
- `src/components/ui/icons/icons.ts` - Added new icons (envelope, check, xCircle)
- `env.example` - Added SITE_URL configuration

## Configuration

### Environment Variables Required

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_TO=admin@yourdomain.com

# Site URL (optional, defaults to http://localhost:4321)
SITE_URL=https://yourdomain.com
```

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for this application
3. Use the App Password as `SMTP_PASS`

## Security Features

- **Token Expiration**: Confirmation tokens expire after 24 hours
- **Unique Tokens**: Each confirmation uses a cryptographically secure random token
- **One-time Use**: Tokens are deleted after use
- **Rate Limiting**: Basic protection against abuse (in-memory storage)

## Production Considerations

### Current Limitations
- **In-Memory Storage**: Confirmation data is lost on server restart
- **No Rate Limiting**: Advanced rate limiting not implemented
- **Single Server**: Won't work with multiple server instances

### Recommended Improvements for Production
1. **Database Storage**: Store confirmations in a database (PostgreSQL, MongoDB, etc.)
2. **Redis Cache**: Use Redis for token storage with TTL
3. **Rate Limiting**: Implement proper rate limiting per IP/email
4. **Email Templates**: Use a proper email templating system
5. **Logging**: Add comprehensive logging for debugging
6. **Monitoring**: Add metrics and alerting

## Testing

### Local Development
1. Set up environment variables in `.env.local`
2. Start the development server: `npm run dev`
3. Submit a contact form
4. Check your email for confirmation link
5. Click the link to complete the process

### Email Testing
- Use services like Mailtrap for development
- Test with real email addresses
- Verify confirmation links work correctly
- Test token expiration

## Troubleshooting

### Common Issues

1. **Emails Not Sending**
   - Check SMTP configuration
   - Verify Gmail App Password is correct
   - Check firewall/network settings

2. **Confirmation Links Not Working**
   - Verify SITE_URL is set correctly
   - Check server logs for errors
   - Ensure token hasn't expired

3. **Form Submissions Failing**
   - Check browser console for JavaScript errors
   - Verify API endpoint is accessible
   - Check server logs for backend errors

### Debug Mode
Enable debug logging by checking the browser console and server logs for detailed error messages.

## Future Enhancements

- [ ] Add email template customization
- [ ] Implement email queue system
- [ ] Add admin dashboard for managing confirmations
- [ ] Support for multiple email providers
- [ ] Email analytics and tracking
- [ ] Spam protection and filtering

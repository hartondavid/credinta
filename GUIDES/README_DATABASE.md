# Database Setup for Contact Messages

This project now includes a PostgreSQL database setup for storing contact form messages using Knex.js.

## Table Structure

The `contact_messages` table stores:
- `id` - Primary key (auto-increment)
- `first_name` - User's first name (255 chars, required)
- `last_name` - User's last name (255 chars, required)
- `email` - User's email (255 chars, required, unique)
- `phone` - User's phone number (255 chars, required, unique)
- `text_area` - Message content (text, required)
- `created_at` - Timestamp when message was created
- `updated_at` - Timestamp when message was last updated

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the project root with your database connection:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name
```

**Examples:**
- **Neon (PostgreSQL)**: `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname`
- **Supabase**: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`
- **Local PostgreSQL**: `postgresql://postgres:password@localhost:5432/calarasi_warriors`

### 3. Database Setup

Run the migration to create the table:

```bash
npm run db:migrate
```

### 4. (Optional) Seed Sample Data

Populate with test data:

```bash
npm run db:seed
```

### 5. Reset Database (Development)

To start fresh:

```bash
npm run db:reset
```

## API Usage

### Store Contact Message

**Endpoint:** `POST /api/contact-message`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+40712345678",
  "text_area": "I need construction services"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Contact message stored successfully",
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+40712345678",
    "text_area": "I need construction services",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Database Management

### Available Scripts

- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Populate database with sample data
- `npm run db:reset` - Reset database (rollback + migrate + seed)

### Manual Database Operations

```bash
# Run migrations manually
npx knex migrate:latest

# Run seeds manually
npx knex seed:run

# Rollback last migration
npx knex migrate:rollback

# Check migration status
npx knex migrate:status
```

## Integration with Contact Form

The contact form in `ContactSection.astro` now automatically stores messages in the database when submitted. The form:

1. Collects user input (first name, last name, email, phone, message)
2. Sends data to `/api/contact-message` endpoint
3. Stores the message in the `contact_messages` table
4. Returns success/error response to the user

## Error Handling

The API handles various error scenarios:

- **Missing fields** - Returns 400 with field validation errors
- **Duplicate email** - Returns 409 with "email already exists" message
- **Duplicate phone** - Returns 409 with "phone number already exists" message
- **Database errors** - Returns 500 with internal server error

## Production Deployment

For production deployment (e.g., Vercel):

1. Set `NODE_ENV=production` in environment variables
2. Use production database credentials
3. Ensure SSL is enabled for database connections
4. The `vercel.json` includes migration files for deployment

## Troubleshooting

### Common Issues

1. **Connection refused** - Check if PostgreSQL is running and accessible
2. **Authentication failed** - Verify database credentials in `.env.local`
3. **Table not found** - Run migrations with `npm run db:migrate`
4. **Permission denied** - Ensure database user has proper permissions

### Database Connection Test

Test your database connection:

```bash
node -e "
import databaseManager from './database.mjs';
databaseManager.healthCheck().then(result => {
  console.log('Database status:', result);
  process.exit(result.connected ? 0 : 1);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
"
```

## Security Considerations

- Never commit `.env.local` to version control
- Use strong database passwords
- Consider connection pooling for production
- Implement proper input validation and sanitization
- Use HTTPS in production for API endpoints

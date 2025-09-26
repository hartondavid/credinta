import knex from 'knex';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Try multiple paths to find knexfile.cjs
let knexConfig;
try {
    // Try relative to current file
    knexConfig = require('./knexfile.cjs');
} catch (error) {
    try {
        // Try relative to project root
        knexConfig = require(join(__dirname, 'knexfile.cjs'));
    } catch (error2) {
        try {
            // Try going up two levels
            knexConfig = require(join(__dirname, '..', '..', 'knexfile.cjs'));
        } catch (error3) {
            // Fallback to inline configuration
            console.log('⚠️ Could not load knexfile.cjs, using inline configuration');
            knexConfig = {
                development: {
                    client: 'pg',
                    connection: process.env.DATABASE_URL,
                    migrations: { directory: './migrations' },
                    seeds: { directory: './seeds' }
                },
                production: {
                    client: 'pg',
                    connection: process.env.DATABASE_URL,
                    ssl: { rejectUnauthorized: false },
                    pool: { min: 1, max: 5 },
                    migrations: { directory: './migrations' },
                    seeds: { directory: './seeds' }

                }
            };
        }
    }
}

class DatabaseManager {
    constructor() {
        this.knex = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            if (!this.knex) {
                console.log('🔌 Connecting to database...');

                // Select the correct environment configuration
                const environment = process.env.NODE_ENV || 'development';
                const config = knexConfig[environment];

                // Validate environment variables for development
                if (environment === 'development') {
                    const required = ['DATABASE_URL'];
                    const missing = required.filter(key => !process.env[key]);

                    if (missing.length > 0) {
                        throw new Error(`Missing required environment variables: ${missing.join(', ')}. Please check your .env.local file.`);
                    }
                }

                console.log('📊 Database config:', {
                    environment,
                    connection: config.connection,
                    migrationsDirectory: config.migrations.directory
                });

                this.knex = knex(config);

                // Test the connection
                await this.knex.raw('SELECT 1');
                this.isConnected = true;
                console.log('✅ Database connected successfully');

                // Check if database exists (PostgreSQL)
                try {
                    const currentDb = await this.knex.raw('SELECT current_database() as current_db');
                    console.log('🎯 Current database:', currentDb.rows[0].current_db);
                } catch (dbError) {
                    console.log('⚠️ Could not check database:', dbError.message);
                }

                // Skip auto-migrations in production since table already exists
                if (environment !== 'production') {
                    try {
                        console.log('🔍 Development environment - running migrations...');
                        await this.runMigrations();
                    } catch (migrationError) {
                        console.error('⚠️ Migration failed:', migrationError.message);
                    }
                } else {
                    console.log('✅ Production environment - skipping auto-migrations (table already exists)');
                }
            }
            return this.knex;
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            console.error('🔍 Connection error details:', error.stack);
            throw error;
        }
    }

    async disconnect() {
        try {
            if (this.knex) {
                await this.knex.destroy();
                this.knex = null;
                this.isConnected = false;
                console.log('✅ Database disconnected successfully');
            }
        } catch (error) {
            console.error('❌ Database disconnection failed:', error.message);
            throw error;
        }
    }

    async healthCheck() {
        try {
            if (!this.knex) {
                await this.connect();
            }
            await this.knex.raw('SELECT 1');
            return { status: 'healthy', connected: true };
        } catch (error) {
            return {
                status: 'unhealthy',
                connected: false,
                error: error.message
            };
        }
    }

    async getKnex() {
        if (!this.knex) {
            await this.connect();
        }
        return this.knex;
    }

    async runMigrations() {
        try {
            console.log('🔄 Starting migrations...');
            if (!this.knex) {
                await this.connect();
            }
            console.log('📋 Running migrations...');
            await this.knex.migrate.latest();
            console.log('✅ Migrations completed successfully');
        } catch (error) {
            console.error('❌ Migration failed:', error.message);
            console.error('🔍 Migration error details:', error.stack);
            throw error;
        }
    }

    async runSeeds() {
        try {
            console.log('🌱 Starting seeds...');
            if (!this.knex) {
                await this.connect();
            }
            console.log('📦 Running seeds...');
            await this.knex.seed.run();
            console.log('✅ Seeds completed successfully');
        } catch (error) {
            console.error('❌ Seeding failed:', error.message);
            console.error('🔍 Seeding error details:', error.stack);
            throw error;
        }
    }

    async resetDatabase() {
        try {
            console.log('🔄 Starting database reset...');
            if (!this.knex) {
                await this.connect();
            }

            // Drop all tables
            console.log('🗑️ Dropping all tables...');
            await this.knex.raw('DROP SCHEMA public CASCADE');
            await this.knex.raw('CREATE SCHEMA public');
            await this.knex.raw('GRANT ALL ON SCHEMA public TO postgres');
            await this.knex.raw('GRANT ALL ON SCHEMA public TO public');

            console.log('✅ Database reset completed successfully');
        } catch (error) {
            console.error('❌ Database reset failed:', error.message);
            console.error('🔍 Reset error details:', error.stack);
            throw error;
        }
    }

    async resetAndMigrate() {
        try {
            console.log('🔄 Starting complete database reset and migration...');

            // Reset database
            await this.resetDatabase();

            // Run migrations
            await this.runMigrations();

            console.log('✅ Database reset and migration completed successfully');
        } catch (error) {
            console.error('❌ Reset and migration failed:', error.message);
            throw error;
        }
    }
}

// Create a singleton instance
const databaseManager = new DatabaseManager();

// Export the manager instance as default
export default databaseManager;

// Graceful shutdown handling
process.on('SIGINT', async () => {
    console.log('\n🔄 Shutting down gracefully...');
    await databaseManager.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🔄 Shutting down gracefully...');
    await databaseManager.disconnect();
    process.exit(0);
});
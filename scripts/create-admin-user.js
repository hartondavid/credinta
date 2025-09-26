import bcrypt from 'bcryptjs';
import databaseManager from '../database.mjs';

async function createDefaultAdmin() {
    try {
        console.log('🔧 Creating default admin user...');

        const knex = await databaseManager.getKnex();

        // Check if admin already exists
        const existingAdmin = await knex('admins').where({ username: 'admin' }).first();

        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            return;
        }

        // Hash the default password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        const adminData = {
            username: 'admin',
            password_hash: hashedPassword,
            email: 'admin@calarasiwarriors.ro',
            full_name: 'Administrator',
            is_active: true
        };

        await knex('admins').insert(adminData);

        console.log('✅ Default admin user created successfully!');
        console.log('📋 Login credentials:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('⚠️  Please change the password after first login!');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        await databaseManager.disconnect();
    }
}

// Run the script
createDefaultAdmin();

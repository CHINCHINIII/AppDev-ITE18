const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables manually since dotenv might not pick up .env in root if script is run differently,
// but dotenv.config() usually looks in current dir.
dotenv.config();

async function createAdmin() {
    const dbConfig = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'carsucart',
        port: process.env.DB_PORT || 3306
    };

    console.log(`Connecting to database: ${dbConfig.database} at ${dbConfig.host}`);

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const adminName = 'Super Admin';
        const adminEmail = 'admin@carsucart.com';
        const plainPassword = 'Admin123!';
        
        // Laravel default bcrypt rounds is 10 or 12. Node bcrypt defaults to 10.
        // We'll use 12 to match typical Laravel setup.
        const saltRounds = 12; 
        let hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        // FIX: Node's bcrypt generates '$2b$' prefixes. Laravel's BcryptHasher (PHP) often expects '$2y$'.
        // We replace the prefix to ensure compatibility.
        hashedPassword = hashedPassword.replace(/^\$2b\$/, '$2y$');

        // Check if admin already exists
        const [rows] = await connection.execute('SELECT * FROM admin WHERE email = ?', [adminEmail]);
        
        if (rows.length > 0) {
            console.log('Admin account with this email already exists.');
            // Update the password just in case user wants to reset it
            await connection.execute('UPDATE admin SET password = ?, name = ?, email_verified_at = NOW() WHERE email = ?', [hashedPassword, adminName, adminEmail]);
            console.log('Updated existing admin account with new password and verified status.');
        } else {
            const sql = `
                INSERT INTO admin (name, email, password, role, is_active, email_verified_at, created_at, updated_at) 
                VALUES (?, ?, ?, 'admin', 1, NOW(), NOW(), NOW())
            `;
            await connection.execute(sql, [adminName, adminEmail, hashedPassword]);
            console.log('Admin account created successfully.');
        }

        console.log('\n--- Admin Credentials ---');
        console.log(`Email:    ${adminEmail}`);
        console.log(`Password: ${plainPassword}`);
        console.log('-------------------------');

    } catch (error) {
        console.error('Error creating admin account:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

createAdmin();

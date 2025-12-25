const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function updateSchema() {
    const dbConfig = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'carsucart',
        port: process.env.DB_PORT || 3306
    };

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Alter the orders table to include new statuses
        const sql = `
            ALTER TABLE orders 
            MODIFY COLUMN status 
            ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'cancelled') 
            NOT NULL DEFAULT 'pending'
        `;
        
        await connection.query(sql);
        console.log('Successfully updated orders table status enum.');

    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        if (connection) await connection.end();
    }
}

updateSchema();

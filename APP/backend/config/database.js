/**
 * Database Configuration and Connection Pool Setup
 * This file handles the MySQL database connection configuration and creates a connection pool
 * for efficient database operations.
 */

import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Database configuration object
 * Uses environment variables with fallback values for local development
 */
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',        // Database host (default: localhost)
    user: process.env.DB_USER || 'root',            // Database username (default: root)
    password: process.env.DB_PASSWORD || 'Qwe.123*', // Database password (default: Qwe.123*)
    database: process.env.DB_NAME || 'Barberin',     // Database name (default: Barberin)
    acquireTimeout: 60000,                          // Connection acquisition timeout (60 seconds)
    timeout: 60000,                                 // Query timeout (60 seconds)
    reconnect: true                                 // Enable automatic reconnection
};

/**
 * Create MySQL connection pool
 * Connection pools improve performance by reusing database connections
 * instead of creating new connections for each query
 */
const pool = mysql.createPool(dbConfig);

/**
 * Test database connection
 * This function tests if the connection pool is working correctly
 * and logs the result to the console
 */
pool.getConnection((err, connection) => {
    if (err) {
        // Log connection error
        console.error('Error connecting to database:', err);
        return;
    }
    // Log successful connection
    console.log('MySQL connection pool created successfully');
    // Release the test connection back to the pool
    connection.release();
});

// Export the connection pool for use in other parts of the application
export default pool;

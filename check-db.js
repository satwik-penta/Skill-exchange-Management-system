const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'skill_exchange'
};

console.log('🔍 Checking database setup...\n');

// Create connection without database first
const connection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }

  console.log('✅ Connected to MySQL server');

  // Create database if it doesn't exist
  connection.query('CREATE DATABASE IF NOT EXISTS skill_exchange', (err) => {
    if (err) {
      console.error('❌ Database creation failed:', err.message);
      connection.end();
      return;
    }

    console.log('✅ Database "skill_exchange" ensured');

    // Switch to the database
    connection.changeUser({ database: 'skill_exchange' }, (err) => {
      if (err) {
        console.error('❌ Database switch failed:', err.message);
        connection.end();
        return;
      }

      // Read and execute the setup script
      const setupSQL = fs.readFileSync(path.join(__dirname, 'database_setup.sql'), 'utf8');

      // Split by semicolon and filter out empty statements
      const statements = setupSQL.split(';').filter(stmt => stmt.trim().length > 0);

      let completed = 0;
      const total = statements.length;

      statements.forEach((statement, index) => {
        if (statement.trim().startsWith('--') || statement.trim() === '') {
          completed++;
          if (completed === total) checkTables();
          return;
        }

        connection.query(statement, (err) => {
          if (err) {
            // Log but don't fail - some statements might already exist
            console.log(`⚠️  Statement ${index + 1} failed (might already exist):`, err.message);
          } else {
            console.log(`✅ Executed statement ${index + 1}/${total}`);
          }

          completed++;
          if (completed === total) {
            // After setup, add missing columns
            addMissingColumns();
          }
        });
      });
    });
  });
});

function checkTables() {
  connection.query('SHOW TABLES', (err, results) => {
    if (err) {
      console.error('❌ Table check failed:', err.message);
    } else {
      console.log('\n📋 Database tables:');
      results.forEach(row => {
        console.log(`   - ${Object.values(row)[0]}`);
      });
    }

    // Test a simple query
    connection.query('SELECT COUNT(*) as userCount FROM users', (err, results) => {
      if (err) {
        console.error('❌ User count query failed:', err.message);
      } else {
        console.log(`\n👥 Current user count: ${results[0].userCount}`);
      }

      connection.end();
      console.log('\n🎉 Database setup check completed!');
    });
  });
}

function addMissingColumns() {
  console.log('\n🔧 Adding missing columns...');

  const alterStatements = [
    "ALTER TABLE users ADD COLUMN phone VARCHAR(20)",
    "ALTER TABLE users ADD COLUMN linkedin VARCHAR(255)",
    "ALTER TABLE users ADD COLUMN github VARCHAR(255)",
    "ALTER TABLE users ADD COLUMN portfolio VARCHAR(255)",
    "ALTER TABLE users ADD COLUMN previousCompanies TEXT",
    "ALTER TABLE users ADD COLUMN isVerified BOOLEAN DEFAULT FALSE",
    "ALTER TABLE users ADD COLUMN verificationToken VARCHAR(255)",
    "ALTER TABLE skills ADD COLUMN level VARCHAR(50) DEFAULT 'Beginner'",
    "ALTER TABLE certificates ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT ''",
    "ALTER TABLE certificates ADD COLUMN organization VARCHAR(255) NOT NULL DEFAULT ''",
    "ALTER TABLE certificates ADD COLUMN description TEXT",
    "ALTER TABLE certificates ADD COLUMN year INT NOT NULL DEFAULT 2024"
  ];

  let completed = 0;
  const total = alterStatements.length;

  alterStatements.forEach((statement, index) => {
    connection.query(statement, (err) => {
      if (err) {
        // Column might already exist - this is OK
        console.log(`⚠️  Column ${index + 1} might already exist:`, err.message);
      } else {
        console.log(`✅ Added column ${index + 1}/${total}`);
      }

      completed++;
      if (completed === total) {
        checkTables();
      }
    });
  });
}
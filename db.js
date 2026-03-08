const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Satwik@8977",
  database: "skill_exchange"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("MySQL Connected");
    // Create tables if they don't exist
    createTables();
  }
});

function createTables() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id BIGINT PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255),
      phone VARCHAR(20),
      location VARCHAR(255),
      linkedin VARCHAR(255),
      github VARCHAR(255),
      portfolio VARCHAR(255),
      bio TEXT,
      qualification VARCHAR(255),
      experience INT DEFAULT 0,
      previousCompanies TEXT,
      profilePicture VARCHAR(500),
      isVerified BOOLEAN DEFAULT FALSE,
      verificationToken VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS skills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId BIGINT NOT NULL,
      skillName VARCHAR(255) NOT NULL,
      level VARCHAR(50) DEFAULT 'Beginner',
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS certificates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId BIGINT NOT NULL,
      title VARCHAR(255) NOT NULL,
      organization VARCHAR(255) NOT NULL,
      description TEXT,
      year INT NOT NULL,
      imagePath VARCHAR(500) NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS exchange_requests (
      id BIGINT PRIMARY KEY,
      fromEmail VARCHAR(255) NOT NULL,
      toEmail VARCHAR(255) NOT NULL,
      skill VARCHAR(255) NOT NULL,
      status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_from_email (fromEmail),
      INDEX idx_to_email (toEmail)
    )`
  ];

  queries.forEach(query => {
    db.query(query, (err) => {
      if (err) {
        console.error("Error creating table:", err);
      }
    });
  });
}

module.exports = db;
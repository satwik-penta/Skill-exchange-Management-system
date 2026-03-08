-- Database setup for Peer Skill Exchange
-- Run this script to create the necessary tables

CREATE DATABASE IF NOT EXISTS skill_exchange;
USE skill_exchange;

-- Users table
CREATE TABLE IF NOT EXISTS users (
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
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId BIGINT NOT NULL,
    skillName VARCHAR(255) NOT NULL,
    level VARCHAR(50) DEFAULT 'Beginner',
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    description TEXT,
    year INT NOT NULL,
    imagePath VARCHAR(500) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Exchange requests table
CREATE TABLE IF NOT EXISTS exchange_requests (
    id BIGINT PRIMARY KEY,
    fromEmail VARCHAR(255) NOT NULL,
    toEmail VARCHAR(255) NOT NULL,
    skill VARCHAR(255) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_from_email (fromEmail),
    INDEX idx_to_email (toEmail)
);

-- Insert some sample data if tables are empty
INSERT IGNORE INTO users (id, firstName, lastName, fullName, email, password, phone, linkedin, github, portfolio, bio, qualification, experience, previousCompanies, profilePicture, isVerified, verificationToken) VALUES
(1772762438477, 'Satwik', 'Penta', 'Satwik Penta', 'satwikpenta53@gmail.com', NULL, '1234567890', 'https://linkedin.com/in/satwik', 'https://github.com/satwik', 'https://portfolio.com', 'Student', '10+2', 6, 'Company A, Company B', '/uploads/profilePicture-1772762438470-633624999.png', TRUE, NULL),
(1772783751257, 'Satwik', 'Penta', 'Satwik Penta', 'satwikpenta53@gmail.com', '$2b$10$Eert3YQ4zXuRE8UAoHjxb.dR5Dldt1H9JILYGuhG7HtSGCKDpYQrW', '1234567890', 'https://linkedin.com/in/satwik', 'https://github.com/satwik', 'https://portfolio.com', 'Hello', 'B.Tech', 5, 'Company A', '/uploads/profilePicture-1772783751251-884228915.png', TRUE, NULL),
(1772792661661, 'BHASKAR', 'KUMAR', 'BHASKAR KUMAR', 'bhaskar93906@gmail.com', '$2b$10$Eert3YQ4zXuRE8UAoHjxb.dR5Dldt1H9JILYGuhG7HtSGCKDpYQrW', '0987654321', 'https://linkedin.com/in/bhaskar', 'https://github.com/bhaskar', 'https://portfolio.com', 'lol', 'B.Tech', 15, 'Company B, Company C', '/uploads/profilePicture-1772792661657-506763476.jpg', TRUE, NULL),
(1772867548301, 'Test', 'User', 'Test User', 'test@example.com', '$2b$10$dummyhash', '1111111111', 'https://linkedin.com/in/test', 'https://github.com/test', 'https://portfolio.com', 'Test bio', 'B.Sc', 3, 'Company D', '/uploads/profilePicture-1772867548299-635723184.png', TRUE, NULL);

INSERT IGNORE INTO skills (userId, skillName, level) VALUES
(1772762438477, 'Python', 'Expert'),
(1772762438477, 'Java', 'Intermediate'),
(1772783751257, 'Java', 'Expert'),
(1772792661661, 'Java', 'Intermediate'),
(1772867548301, 'JavaScript', 'Beginner'),
(1772867548301, 'React', 'Intermediate');
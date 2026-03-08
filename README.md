# Peer Skill Exchange Platform

A modern web application for professionals to exchange skills and knowledge.

## Features

- **User Authentication**: Email/password registration with verification, Google OAuth, GitHub OAuth
- **Profile Management**: Comprehensive user profiles with skills, certificates, experience
- **Skill Exchange**: Request and manage skill exchange requests
- **Professional UI**: Modern, responsive design with professional styling

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: Passport.js (Local, Google, GitHub)
- **File Uploads**: Multer
- **Email**: Nodemailer

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd peer-skill-exchange
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Create a MySQL database named `skill_exchange`
   - Run the SQL script in `database_setup.sql` to create tables

4. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Fill in your configuration:
     ```env
     # Database
     DB_HOST=localhost
     DB_USER=your_mysql_username
     DB_PASSWORD=your_mysql_password
     DB_NAME=skill_exchange

     # Session
     SESSION_SECRET=your-random-session-secret

     # Email (Gmail)
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password

     # Google OAuth
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret

     # GitHub OAuth
     GITHUB_CLIENT_ID=your-github-client-id
     GITHUB_CLIENT_SECRET=your-github-client-secret
     ```

5. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5000/auth/google/callback`

6. **GitHub OAuth Setup**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL: `http://localhost:5000/auth/github/callback`

7. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

8. **Access the application**
   - Open `http://localhost:5000` in your browser

## API Endpoints

### Authentication
- `POST /api/users` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/auth/verify-email` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email
- `GET /auth/google` - Google OAuth login
- `GET /auth/github` - GitHub OAuth login

### Users
- `GET /api/users` - Get all users (with filters)
- `GET /api/users/:id` - Get user profile with skills and certificates
- `PUT /api/users/:id` - Update user profile

### Exchange Requests
- `POST /api/users/exchange-request` - Send exchange request
- `GET /api/users/exchange-request/:email` - Get incoming requests
- `GET /api/users/exchange-request-sent/:email` - Get sent requests
- `PUT /api/users/exchange-request/:id/accept` - Accept request
- `PUT /api/users/exchange-request/:id/reject` - Reject request

## Project Structure

```
peer-skill-exchange/
├── server.js                 # Main server file
├── db.js                     # Database connection and setup
├── routes/
│   ├── userRoutes.js         # User-related routes
│   └── authRoutes.js         # Authentication routes
├── middleware/
│   └── authMiddleware.js     # Authentication middleware
├── config/
│   └── passport.js           # Passport configuration
├── uploads/                  # Uploaded files directory
├── database_setup.sql        # Database schema
├── package.json
├── .env.example
└── *.html                    # Frontend pages
```

## Security Features

- Password hashing with bcrypt
- Email verification for new accounts
- Input validation and sanitization
- Secure file upload handling
- Session-based authentication
- OAuth integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
- `POST /api/users` - Register new user
- `POST /api/users/login` - User login
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Exchange Requests
- `POST /api/users/exchange-request` - Send exchange request
- `GET /api/users/exchange-request/:email` - Get incoming requests
- `GET /api/users/exchange-request-sent/:email` - Get sent requests
- `PUT /api/users/exchange-request/:id/accept` - Accept request
- `PUT /api/users/exchange-request/:id/reject` - Reject request

## Project Structure

```
peer-skill-exchange/
├── server.js              # Main server file
├── routes/
│   └── userRoutes.js      # API routes
├── uploads/               # Uploaded files
├── data.json              # Data storage
├── package.json           # Dependencies
├── index.html             # Login page
├── dashboard.html         # Main dashboard
├── createProfile.html     # Profile creation
├── profile.html           # Profile view
├── search.html            # Skill search
├── requests.html          # Incoming requests
└── sentRequests.html      # Sent requests
```

## Security Features

- Password hashing with bcrypt
- Input validation
- File upload restrictions (images only, 5MB limit)
- CORS enabled for cross-origin requests

## Future Enhancements

- Real-time notifications
- Messaging system
- Skill ratings and reviews
- Database integration (MongoDB/PostgreSQL)
- User verification
- Advanced search filters
- Mobile app

## Contributing

Feel free to fork and contribute to this project. Pull requests are welcome!

## License

ISC
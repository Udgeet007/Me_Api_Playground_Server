MeApi Playground  Backend API
A Node.js backend API for managing user profiles with Express.js and MongoDB. This API allows you to create, read, update, and search user profiles with comprehensive profile information including education, skills, projects, work experience, and social links.
🚀 Features

Create user profiles with comprehensive information
Retrieve all profiles with pagination and search functionality
Update existing profiles (partial updates supported)
Search profiles by skills
Input validation and error handling
MongoDB integration with Mongoose

📁 Project Structure
backend/
├── controllers/
│   └── profile.controller.js    # Profile business logic
├── routes/
│   └── profile.routes.js        # API route definitions
├── models/
│   └── Profile.js               # MongoDB schema (assumed)
├── middleware/                  # Custom middleware (if any)
├── config/
│   └── database.js              # Database configuration (assumed)
├── package.json
├── server.js                    # Main server file
└── README.md
🛠️ Installation & Setup

Clone the repository

bash   git clone <repository-url>
   cd backend

Install dependencies

bash   npm install

Environment Variables
Create a .env file in the root directory:

env   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/profiledb
   NODE_ENV=development

Start the server

bash   # Development mode
   npm run dev

   # Production mode
   npm start
📚 API Documentation
Base URL
http://localhost:9889/api


Updated API Endpoints:

Create Profile - POST http://localhost:9889/api/profile/create
deploy Url Api - POST https://me-api-playground-server.onrender.com/api/profile/create

Create a new user profile


Get All Profiles - GET http://localhost:9889/api/profile/profiles
deploy Url Api - POST https://me-api-playground-server.onrender.com/api/profile/profiles
Retrieve all profiles with pagination and search


Update Profile - PUT http://localhost:9889/api/profile/update/:id
deploy Url Api - POST https://me-api-playground-server.onrender.com/api/profile/update/:id
Search by ID and update an existing profile (partial updates supported)


Search by Skills - GET http://localhost:9889/api/profile/search/skills?skills=javascript
deploy Url Api - POST https://me-api-playground-server.onrender.com/api/profile/search/skills?skills=javascript
Search profiles based on specific skills



The documentation now reflects your actual server configuration running on port 9889 with the /api/profile base path, and includes the specific functionality descriptions you requested.
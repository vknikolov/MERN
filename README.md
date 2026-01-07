# MERN Stack Application

A full-stack web application built with MongoDB, Express, React, and Node.js for managing places with user authentication and image uploads.

## Features

- 🔐 User authentication with JWT
- 📸 Image upload functionality
- 🗺️ Location-based services with coordinates
- ✏️ CRUD operations for places
- 👤 User profiles with avatars
- 🔒 Protected routes and authorization
- 📱 Responsive design

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **React Router v5** - Routing
- **Context API** - State management
- **Custom Hooks** - Form management & HTTP requests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/vknikolov/MERN.git
cd MERN
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGODB_USERNAME=your_mongodb_username
MONGODB_PASSWORD=your_mongodb_password
JWT_SECRET=your_super_secret_jwt_key
```

Create uploads directory:

```bash
mkdir -p uploads/images
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_BACKEND_URL=http://localhost:8080/api
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

The backend server will run on **http://localhost:8080**

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend application will run on **http://localhost:3000**

## Project Structure

```
MERN/
├── backend/
│   ├── controllers/       # Route controllers (business logic)
│   │   ├── places.js
│   │   └── users.js
│   ├── middleware/        # Custom middleware
│   │   ├── authentication.js
│   │   └── file-upload.js
│   ├── models/           # MongoDB/Mongoose models
│   │   ├── http-error.js
│   │   ├── place.js
│   │   └── user.js
│   ├── routes/           # API route definitions
│   │   ├── places.js
│   │   └── users.js
│   ├── util/             # Utility functions
│   │   ├── jwt-token.js
│   │   └── location.js
│   ├── uploads/          # Uploaded images storage
│   │   └── images/
│   ├── .env              # Environment variables
│   └── app.js            # Express app configuration
│
└── frontend/
    ├── public/           # Static files
    │   ├── index.html
    │   └── manifest.json
    └── src/
        ├── helpers/      # Custom hooks & utilities
        │   ├── custom-hooks/
        │   │   ├── http.js
        │   │   ├── useDebounce.js
        │   │   └── useFormReducer.js
        │   └── utils/
        │       └── validators.js
        ├── places/       # Place-related components & pages
        │   ├── components/
        │   │   ├── place-item/
        │   │   └── place-list/
        │   └── pages/
        │       ├── NewPlace.js
        │       ├── UpdatePlace.js
        │       └── UserPlaces.js
        ├── shared/       # Shared components
        │   ├── components/
        │   │   ├── form-elements/
        │   │   ├── navigation/
        │   │   └── ui-elements/
        │   └── context/
        │       └── authentication-context.js
        ├── user/         # User-related components & pages
        │   ├── components/
        │   │   ├── user-item/
        │   │   └── users-list/
        │   └── pages/
        │       ├── Authentication.js
        │       └── Users.js
        ├── App.js        # Main app component
        └── index.js      # React entry point
```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users/signup` - Register new user (requires multipart/form-data with image)
- `POST /api/users/login` - Login user (returns JWT token)

### Places (Some routes require authentication)
- `GET /api/places/:placeId` - Get place by ID
- `GET /api/places/user/:userId` - Get all places by user ID
- `POST /api/places` - Create new place (🔒 requires authentication + image upload)
- `PATCH /api/places/:placeId` - Update place (🔒 requires authentication)
- `DELETE /api/places/:placeId` - Delete place (🔒 requires authentication)

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User signs up or logs in
2. Server returns JWT token
3. Frontend stores token in context
4. Token is sent in `Authorization` header for protected routes: `Bearer <token>`

## Features Details

### User Authentication
- Secure password hashing with bcrypt
- JWT token generation and verification
- Protected routes on both frontend and backend

### Image Upload
- User avatars during signup
- Place images when creating places
- File validation (size, type)
- Stored locally in `uploads/images/`

### Place Management
- Create places with title, description, address, and image
- Automatic coordinate generation from address
- Update and delete own places
- View places by user

## Environment Variables

### Backend (.env)
- `MONGODB_USERNAME` - MongoDB username
- `MONGODB_PASSWORD` - MongoDB password
- `JWT_SECRET` - Secret key for JWT signing

### Frontend (.env)
- `REACT_APP_BACKEND_URL` - Backend API URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

Veselin Nikolov - [GitHub](https://github.com/vknikolov)

## Acknowledgments

- Built as a learning project for MERN stack development
- Inspired by modern web application architecture patterns

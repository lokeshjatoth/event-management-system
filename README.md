# Event Management System

A full-stack web application for managing and participating in events. Built with React, Node.js, Express, and MongoDB.

## 🌟 Live Demo

- Frontend: [https://event-management-system-gilt.vercel.app](https://event-management-system-gilt.vercel.app)
- Backend: [https://event-management-system-dnlr.onrender.com](https://event-management-system-dnlr.onrender.com)

## ✨ Features

- 👥 User Authentication (Sign Up, Sign In, Profile Management)
- 📅 Event Creation and Management
- 🔍 Event Search and Filtering
- 💖 Real-time Likes and Participation Updates
- 📱 Responsive Design
- 🖼️ Image Upload Support
- 🎫 Event Categories and Ticket Management

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- Socket.io-client for real-time features
- Axios for API requests
- React Router for navigation

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for real-time updates
- Bcrypt for password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/lokeshjatoth/event-management-system.git
cd event-management-system
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables

Backend (.env):
```env
PORT=3001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Frontend (.env):
```env
VITE_BACKEND_URL=http://localhost:3001
```

5. Start the Development Servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## 📱 Features Overview

### User Management
- User registration and authentication
- Profile management
- Secure password hashing
- JWT-based session management

### Event Management
- Create, edit, and delete events
- Upload event images
- Set event categories and ticket prices
- Real-time updates for likes and participants

### Search and Filter
- Search events by title
- Filter by category
- Filter by price range
- Filter by date and time

### Real-time Features
- Live updates for event likes
- Real-time participant count updates
- Socket.io integration for instant updates

## 🔒 Environment Variables

### Backend
- `PORT`: Server port number
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT
- `FRONTEND_URL`: Frontend application URL
- `COOKIE_SECRET`: Secret for cookie signing

### Frontend
- `VITE_BACKEND_URL`: Backend API URL

## 📝 API Endpoints

### Authentication
- POST `/api/v1/user/signup`: Register new user
- POST `/api/v1/user/login`: User login
- POST `/api/v1/user/logout`: User logout
- GET `/api/v1/user/profile`: Get user profile

### Events
- GET `/api/v1/event/all`: Get all events
- POST `/api/v1/event/create`: Create new event
- GET `/api/v1/event/:id`: Get event details
- PUT `/api/v1/event/:id`: Update event
- DELETE `/api/v1/event/:id`: Delete event

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Lokesh Jatoth
- GitHub: [@lokeshjatoth](https://github.com/lokeshjatoth)

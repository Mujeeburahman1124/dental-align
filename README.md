# 🦷 DentAlign - Smart Dental Management System

<div align="center">

![DentAlign Logo](https://img.shields.io/badge/DentAlign-Smart%20Dental%20System-007AFF?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-10b981?style=for-the-badge)
![License](https://img.shields.io/badge/License-Student%20Project-yellow?style=for-the-badge)

**A modern, full-stack dental clinic management system built with MERN stack**

[Quick Start](#-quick-start) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

</div>

---

## 📖 About

**DentAlign** is a comprehensive dental management system designed as a degree project. It provides a complete solution for managing dental clinics with features for patients, dentists, and administrators.

### 🎯 Project Goals
- ✅ Create a modern, user-friendly dental booking system
- ✅ Implement role-based authentication and authorization
- ✅ Provide secure digital treatment records (DTR)
- ✅ Build responsive, beautiful UI with modern design
- ✅ Follow industry best practices for MERN stack development

---

## ✨ Features

### 👥 For Patients
- 📅 **Easy Appointment Booking** - Book appointments in 4 simple steps
- 📋 **Digital Treatment Records** - Access medical history anytime
- 💰 **Payment Management** - Track balances and insurance
- 🔔 **Appointment Reminders** - Never miss an appointment
- 📱 **Responsive Dashboard** - Access from any device

### 👨‍⚕️ For Dentists
- 📊 **Daily Schedule View** - See all appointments at a glance
- 📝 **Treatment Notes** - Add and manage patient notes
- 💊 **Prescription Management** - E-prescribe medications
- 📈 **Patient History** - Complete medical records access
- ⏰ **Time Management** - Optimized scheduling system

### 👨‍💼 For Administrators
- 💼 **Business Analytics** - Revenue, occupancy, patient stats
- 👥 **User Management** - Manage dentists and staff
- 📊 **Financial Reports** - Track clinic performance
- ⚙️ **System Settings** - Configure clinic operations
- 📧 **Notifications** - Send updates to users

---

## 🛠 Tech Stack

### Frontend
- **React 19.2** - UI library
- **React Router DOM** - Navigation
- **TailwindCSS 4** - Modern styling
- **Axios** - HTTP requests
- **Vite** - Build tool & dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local or Atlas account)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/dental-align.git
cd dental-align
```

2. **Install dependencies:**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install bcryptjs cors dotenv express jsonwebtoken mongoose
cd ..
```

3. **Configure database:**
   - Create MongoDB Atlas account (free) OR install MongoDB locally
   - Copy your connection string
   - Open `server/.env` and update `MONGO_URI`

4. **Test database connection:**
```bash
node server/test-db-connection.js
```

5. **Start the application:**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

6. **Open your browser:**
   - Navigate to `http://localhost:5173`
   - You should see the DentAlign landing page!

📖 **For detailed instructions, see [QUICK_START.md](./QUICK_START.md)**

---

## 📂 Project Structure

```
dental-align/
├── 📂 server/                 # Backend (Express + MongoDB)
│   ├── controllers/           # Business logic
│   ├── models/                # Database schemas
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth middleware
│   └── index.js               # Server entry point
│
├── 📂 src/                    # Frontend (React)
│   ├── pages/                 # Page components
│   │   ├── auth/              # Login, Register
│   │   ├── dashboard/         # Dashboards
│   │   ├── dentist/           # Dentist pages
│   │   ├── admin/             # Admin pages
│   │   └── patient/           # Patient pages
│   ├── components/            # Reusable components
│   ├── App.jsx                # Main app & routing
│   └── index.css              # Global styles
│
├── 📄 QUICK_START.md          # Quick start guide
├── 📄 IMPLEMENTATION_GUIDE.md # Full implementation guide
├── 📄 PROJECT_STRUCTURE.md    # Detailed structure docs
└── 📄 README.md               # This file
```

📖 **For detailed structure, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**

---

## 🎨 Screenshots

### Landing Page
Modern, professional landing page with feature showcase

### Authentication
Beautiful split-screen login and registration with role selection

### Patient Dashboard
Comprehensive dashboard with appointments, records, and health tips

### Booking System
4-step booking process with calendar and time slot selection

### Dentist Dashboard
Daily schedule with patient information and quick actions

### Admin Dashboard
Business metrics, recent appointments, and management tools

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](./QUICK_START.md) | Get started in 5 minutes |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Complete implementation guide with database setup, backend, API endpoints, testing, and deployment |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Detailed file organization, data flow, and architecture |

---

## 🔐 Security Features

- ✅ **Password Hashing** - Using bcryptjs with salt
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-Based Access** - Different permissions for different roles
- ✅ **Protected Routes** - Frontend and backend route protection
- ✅ **HIPAA-Compliant Design** - Privacy-focused architecture
- ✅ **Input Validation** - Server-side validation

---

## 🌟 Key Highlights

### Modern UI/UX
- **Premium Design** - Professional, modern interface
- **Responsive Layout** - Works on all devices
- **Smooth Animations** - Enhanced user experience
- **Intuitive Navigation** - Easy to use

### Robust Backend
- **RESTful API** - Clean API architecture
- **MongoDB Integration** - Scalable NoSQL database
- **Error Handling** - Comprehensive error management
- **Async/Await** - Modern JavaScript patterns

### Best Practices
- **Component Structure** - Organized and maintainable
- **Code Quality** - Clean, readable code
- **Security First** - Security best practices followed
- **Scalable Architecture** - Ready for growth

---

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get single appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

All appointment routes require authentication.

---

## 🧪 Testing

### Manual Testing
1. Register as patient
2. Login with credentials
3. Book an appointment
4. View patient dashboard
5. Test dentist dashboard
6. Test admin dashboard

### API Testing
Use Postman or curl to test API endpoints:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@test.com","phone":"0771234567","password":"test123","role":"patient"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test123"}'
```

---

## 🚢 Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Create new web service
3. Set environment variables (MONGO_URI, JWT_SECRET)
4. Deploy

### Frontend (Vercel/Netlify)
1. Build production: `npm run build`
2. Deploy `dist` folder
3. Update API URL to production backend

📖 **For detailed deployment, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md#deployment)**

---

## 🎓 For Project Presentation

### What to Demonstrate:
1. ✅ **Landing Page** - Show modern UI
2. ✅ **User Registration** - Patient and Dentist signup
3. ✅ **Authentication** - Login with role-based redirect
4. ✅ **Booking System** - Complete booking flow
5. ✅ **Patient Dashboard** - Full feature showcase
6. ✅ **Dentist Dashboard** - Schedule and patient management
7. ✅ **Admin Dashboard** - Business metrics
8. ✅ **Database** - Show MongoDB collections
9. ✅ **API** - Demonstrate endpoints in Postman
10. ✅ **Security** - Explain JWT, password hashing

### Key Points to Highlight:
- **Modern Tech Stack** - MERN (industry-standard)
- **Security** - JWT authentication, bcrypt hashing
- **UI/UX** - Professional, modern design
- **Scalability** - Cloud-ready architecture
- **Best Practices** - Clean code, proper structure
- **Role-Based Access** - Different dashboards for different users

---

## 🛠 Development

### Available Scripts

```bash
# Frontend development
npm run dev          # Start Vite dev server

# Backend development
npm run server       # Start Express server with nodemon

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

---

## 🤝 Contributing

This is a student project, but suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is created as a student degree project for educational purposes.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **MongoDB** for the excellent database
- **React** team for the amazing library
- **TailwindCSS** for the beautiful styling system
- **Express** team for the robust backend framework
- All open-source contributors

---

## 📞 Support

If you have any questions or need help:

1. 📖 Check [QUICK_START.md](./QUICK_START.md)
2. 📚 Read [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
3. 🔍 Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
4. 🐛 Check browser console and terminal for errors

---

<div align="center">

**Built with ❤️ for learning and education**

⭐ Star this repo if you found it helpful!

</div>

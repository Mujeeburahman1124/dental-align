# 📁 DentAlign Project Structure
## Complete File Organization & Architecture

---

## 📂 Root Directory Structure

```
dental-align/
├── 📂 server/                    # Backend (Node.js + Express + MongoDB)
├── 📂 src/                       # Frontend (React + TailwindCSS)
├── 📂 public/                    # Static assets
├── 📄 IMPLEMENTATION_GUIDE.md    # Full implementation guide
├── 📄 QUICK_START.md            # Quick start instructions
├── 📄 PROJECT_STRUCTURE.md       # This file
├── 📄 README.md                  # Project overview
├── 📄 package.json               # Frontend dependencies
├── 📄 vite.config.js            # Vite configuration
├── 📄 tailwind.config.js        # TailwindCSS configuration
└── 📄 .gitignore                # Git ignore rules
```

---

## 🔧 Backend Structure (`server/`)

```
server/
├── 📂 controllers/              # Business logic
│   ├── authController.js        # Authentication (register, login)
│   ├── appointmentController.js # Appointment management
│   └── userController.js        # User management
│
├── 📂 models/                   # Database schemas
│   ├── User.js                  # User model (patients, dentists, admins)
│   └── Appointment.js           # Appointment model
│
├── 📂 routes/                   # API endpoints
│   ├── auth.js                  # /api/auth routes
│   └── appointments.js          # /api/appointments routes
│
├── 📂 middleware/               # Custom middleware
│   └── authMiddleware.js        # JWT verification
│
├── 📄 index.js                  # Server entry point
├── 📄 .env                      # Environment variables (DO NOT COMMIT!)
└── 📄 test-db-connection.js    # Database connection test
```

### Backend Files Explained:

#### **`server/index.js`** - Main Server File
- Sets up Express app
- Connects to MongoDB
- Configures middleware (CORS, JSON)
- Registers routes
- Starts server on port 5000

#### **`server/models/User.js`** - User Schema
```javascript
Fields:
- fullName: String
- email: String (unique)
- phone: String
- password: String (hashed)
- role: String (patient/dentist/admin)
- slmcNumber: String (dentists only)
- specialization: String (dentists only)

Methods:
- matchPassword(): Compare passwords
- Pre-save hook: Hash password before saving
```

#### **`server/models/Appointment.js`** - Appointment Schema
```javascript
Fields:
- patient: ObjectId (ref: User)
- dentist: ObjectId (ref: User)
- date: Date
- time: String
- service: String
- status: String (pending/confirmed/completed/cancelled)
- notes: String
```

#### **`server/controllers/authController.js`** - Authentication Logic
```javascript
Functions:
- registerUser(): Create new user account
- loginUser(): Authenticate user and return JWT token
- generateToken(): Create JWT token
```

#### **`server/routes/auth.js`** - Auth API Endpoints
```javascript
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
```

#### **`server/middleware/authMiddleware.js`** - JWT Protection
```javascript
- Verifies JWT token from Authorization header
- Attaches user to request object
- Used to protect routes requiring authentication
```

---

## 🎨 Frontend Structure (`src/`)

```
src/
├── 📂 pages/                    # All page components
│   ├── 📂 auth/                 # Authentication pages
│   │   ├── LoginPage.jsx        # Login page
│   │   └── RegisterPage.jsx     # Registration page
│   │
│   ├── 📂 dashboard/            # Dashboard pages
│   │   └── PatientDashboard.jsx # Patient dashboard
│   │
│   ├── 📂 dentist/              # Dentist pages
│   │   └── DentistDashboard.jsx # Dentist dashboard
│   │
│   ├── 📂 admin/                # Admin pages
│   │   ├── AdminDashboard.jsx   # Admin dashboard
│   │   └── AdminBalance.jsx     # Financial management
│   │
│   ├── 📂 patient/              # Patient-specific pages
│   │   ├── MyAppointments.jsx   # View appointments
│   │   ├── DigitalTreatmentRecord.jsx # Medical records
│   │   └── BalancePage.jsx      # Payment info
│   │
│   ├── HomePage.jsx             # Landing page
│   └── BookingPage.jsx          # Appointment booking
│
├── 📂 components/               # Reusable components
│   ├── 📂 shared/               # Shared components
│   │   ├── Header.jsx           # Navigation header
│   │   └── Footer.jsx           # Footer component
│   └── ProtectedRoute.jsx       # Route protection component
│
├── 📄 App.jsx                   # Main app component & routing
├── 📄 main.jsx                  # React app entry point
└── 📄 index.css                 # Global styles & TailwindCSS
```

### Frontend Files Explained:

#### **`src/App.jsx`** - Application Router
```javascript
Routes:
/ - HomePage (Landing page)
/login - LoginPage
/register - RegisterPage
/booking - BookingPage

Protected Routes (Patient):
/patient/dashboard - PatientDashboard
/patient/appointments - MyAppointments
/patient/records - DigitalTreatmentRecord
/patient/balance - BalancePage

Protected Routes (Dentist):
/dentist/dashboard - DentistDashboard

Protected Routes (Admin):
/admin/dashboard - AdminDashboard
/admin/balance - AdminBalance
```

#### **`src/pages/HomePage.jsx`** - Landing Page
Features:
- Hero section with CTA
- Feature showcase (3 cards)
- Statistics section
- Why choose section
- Call-to-action section
- Footer with newsletter

#### **`src/pages/auth/LoginPage.jsx`** - Login Page
Features:
- Beautiful split-screen design
- Role selector (Patient/Dentist/Admin)
- Email & password fields
- Remember me checkbox
- Social login buttons (Google, Apple)
- Responsive design

#### **`src/pages/auth/RegisterPage.jsx`** - Registration Page
Features:
- Patient/Dentist toggle
- Dynamic form fields based on role
- SLMC Number & Specialization for dentists
- Phone number with country code (+94)
- Password visibility toggle
- Validation and error handling

#### **`src/pages/BookingPage.jsx`** - Appointment Booking
Features:
- 4-step booking process (Progress indicator)
- Calendar date picker
- Morning/Afternoon time slots
- Service selection
- Dentist selection
- Booking summary sidebar
- Price breakdown

#### **`src/pages/dashboard/PatientDashboard.jsx`** - Patient Dashboard
Features:
- Sidebar navigation
- Quick actions (Book, Records, Contact)
- Next appointment card
- Recent activity feed
- Health tip widget
- Insurance status
- Clinic location map

#### **`src/pages/dentist/DentistDashboard.jsx`** - Dentist Dashboard
Features:
- Today's schedule
- Appointment cards with status
- Patient information
- Quick actions (Notes, Records, Prescribe)
- Statistics overview

#### **`src/pages/admin/AdminDashboard.jsx`** - Admin Dashboard
Features:
- Business metrics (Revenue, Patients, Occupancy)
- Recent appointments table
- Top performing dentists
- Quick management actions

#### **`src/components/ProtectedRoute.jsx`** - Route Protection
```javascript
Purpose:
- Checks if user is authenticated
- Verifies user role matches allowed roles
- Redirects to login if unauthorized
- Used to protect dashboard routes
```

#### **`src/index.css`** - Global Styles
```css
Includes:
- TailwindCSS imports
- Custom color theme (Primary blues)
- Button styles (btn, btn-primary, btn-outline)
- Input styles
- Card styles
- Badge styles (success, warning, error, info)
- Custom scrollbar
- Animations (fadeIn)
```

---

## 🔄 Data Flow

### User Registration Flow:
```
1. User fills RegisterPage form
   ↓
2. Frontend sends POST to /api/auth/register
   ↓
3. authController.registerUser() validates data
   ↓
4. User model hashes password (pre-save hook)
   ↓
5. User saved to MongoDB
   ↓
6. JWT token generated and returned
   ↓
7. Token stored in localStorage
   ↓
8. User redirected to dashboard based on role
```

### User Login Flow:
```
1. User fills LoginPage form
   ↓
2. Frontend sends POST to /api/auth/login
   ↓
3. authController.loginUser() finds user
   ↓
4. Password compared using bcrypt
   ↓
5. JWT token generated if valid
   ↓
6. Token stored in localStorage
   ↓
7. User redirected to appropriate dashboard
```

### Protected Route Access:
```
1. User navigates to /patient/dashboard
   ↓
2. ProtectedRoute component checks localStorage
   ↓
3. If no token → redirect to /login
   ↓
4. If wrong role → redirect to /login
   ↓
5. If valid → render PatientDashboard
```

### Appointment Booking Flow:
```
1. User fills booking form (date, time, service)
   ↓
2. Frontend sends POST to /api/appointments
   ↓
3. authMiddleware verifies JWT token
   ↓
4. appointmentController creates appointment
   ↓
5. Appointment saved to MongoDB
   ↓
6. Confirmation returned
   ↓
7. User sees success message
```

---

## 🎨 Design System

### Colors:
```css
Primary Blue: #007AFF
Primary Hover: #0066D6
Accent Cyan: #00E5FF
Success Green: #10b981
Warning Yellow: #f59e0b
Error Red: #ef4444
Background: #F8FAFC
Text Dark: #111827
Text Gray: #6B7280
```

### Typography:
```css
Font Family: 'Inter', system-ui, sans-serif
Headings: font-bold, font-extrabold
Body: font-medium
Labels: font-bold uppercase tracking-widest
```

### Components:
```css
Cards: rounded-2xl, border, shadow-sm
Buttons: rounded-xl, font-bold, transition-all
Inputs: rounded-xl, border, focus:ring-2
Badges: rounded-full, text-xs, font-bold
```

---

## 🔐 Security Features

1. **Password Hashing**
   - Uses bcryptjs with salt rounds of 10
   - Passwords never stored in plain text

2. **JWT Authentication**
   - Token expires in 30 days
   - Stored in localStorage
   - Verified on protected routes

3. **Role-Based Access**
   - Different dashboards for different roles
   - ProtectedRoute component validates roles
   - Backend also validates user role

4. **Input Validation**
   - Required fields enforced
   - Email validation
   - Phone format validation
   - Password strength (can be enhanced)

---

## 📦 Dependencies

### Frontend (`package.json`):
```json
{
  "react": "^19.2.0",
  "react-router-dom": "^7.13.0",
  "axios": "^1.13.4",
  "tailwindcss": "^4.1.18",
  "vite": "^7.2.4"
}
```

### Backend (`server/package.json`):
```json
{
  "express": "^5.2.1",
  "mongoose": "^9.1.5",
  "bcryptjs": "^3.0.3",
  "jsonwebtoken": "^9.0.3",
  "cors": "^2.8.6",
  "dotenv": "^17.2.3",
  "nodemon": "^3.1.11"
}
```

---

## 🚀 Development Workflow

### Starting Development:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### Making Changes:

**Adding a new page:**
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link where needed

**Adding a new API endpoint:**
1. Create controller function in `server/controllers/`
2. Add route in `server/routes/`
3. Register route in `server/index.js`

**Modifying database:**
1. Update schema in `server/models/`
2. Update controller to use new fields
3. Update frontend forms if needed

---

## 📝 Key Files to Customize for Your Project

1. **`package.json`** - Update name, description
2. **`README.md`** - Add your project details
3. **`src/index.css`** - Customize colors, fonts
4. **`src/pages/HomePage.jsx`** - Update clinic name, images
5. **`server/.env`** - **CRITICAL**: Set your own MongoDB and JWT secret

---

## 🎯 For Project Presentation

### Files to Demonstrate:

**Architecture:**
- `src/App.jsx` - Show routing structure
- `server/index.js` - Show server setup
- `server/models/User.js` - Show data model

**Frontend:**
- `src/pages/HomePage.jsx` - Landing page design
- `src/pages/dashboard/PatientDashboard.jsx` - Main dashboard
- `src/components/ProtectedRoute.jsx` - Security implementation

**Backend:**
- `server/controllers/authController.js` - Authentication logic
- `server/middleware/authMiddleware.js` - JWT verification
- `server/routes/auth.js` - API routing

---

**This structure follows industry best practices for MERN stack applications! 🚀**

*For implementation help, see: QUICK_START.md and IMPLEMENTATION_GUIDE.md*

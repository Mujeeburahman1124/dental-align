# 🏗️ DentAlign System Architecture Diagram - Drawing Guide

## 📐 Complete Visual Guide for Creating HD Architecture Diagram

---

## 🎨 Canvas Setup

- **Orientation**: Landscape (Horizontal)
- **Size**: A4 or 1920x1080px for HD quality
- **Background**: White or light gray grid pattern
- **Title**: "DentAlign - 3-Tier MERN Architecture" at the top

---

## 📊 Layer 1: PRESENTATION LAYER (Top Third)

### Box Specifications:
- **Color**: Light Blue (#E3F2FD)
- **Border**: Dark Blue (#1976D2), 3px
- **Position**: Top of diagram, full width
- **Height**: 30% of canvas

### Header:
```
┌─────────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Client-Side)                               │
│  Technology: React 19 + Vite 7 + TailwindCSS 4                  │
│  Port: 5173 | URL: http://localhost:5173                        │
└─────────────────────────────────────────────────────────────────┘
```

### Components to Draw (Inside the box):

**Row 1: Main Application**
```
┌──────────────────────────────────────────────┐
│  React Application (SPA)                     │
│  ⚛️ React 19.2.0                             │
│  ⚡ Vite Build Tool                          │
│  🎨 TailwindCSS 4.1.18                       │
└──────────────────────────────────────────────┘
```

**Row 2: Pages/Components** (Draw 7 small boxes in a row)
```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│HomePage │ │LoginPage│ │Register │ │Booking  │ │Patient  │ │Dentist  │ │Admin    │
│         │ │         │ │Page     │ │Page     │ │Dashboard│ │Dashboard│ │Dashboard│
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

**Row 3: Supporting Libraries** (3 boxes)
```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ React Router DOM │  │  Axios HTTP      │  │  AuthContext     │
│ v7.13.0          │  │  Client v1.13.4  │  │  (State Mgmt)    │
│ • Protected      │  │  • Base URL:     │  │  • JWT Storage   │
│   Routes         │  │    :5000/api     │  │  • User State    │
│ • Role-based     │  │  • Interceptors  │  │  • localStorage  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 📊 Layer 2: APPLICATION LAYER (Middle Third)

### Box Specifications:
- **Color**: Light Green (#E8F5E9)
- **Border**: Dark Green (#388E3C), 3px
- **Position**: Middle of diagram, full width
- **Height**: 40% of canvas

### Header:
```
┌─────────────────────────────────────────────────────────────────┐
│  APPLICATION LAYER (Server-Side)                                │
│  Technology: Node.js + Express.js                               │
│  Port: 5000 | URL: http://localhost:5000                        │
└─────────────────────────────────────────────────────────────────┘
```

### Components to Draw:

**Row 1: Server Core**
```
┌────────────────────────────────────────────────────────┐
│  Express.js Server (index.js)                          │
│  🟢 Node.js Runtime                                    │
│  🚀 Express v5.2.1                                     │
│                                                        │
│  Middleware Stack:                                     │
│  • CORS (Cross-Origin Resource Sharing)               │
│  • express.json() (Body Parser)                       │
│  • authMiddleware (JWT Verification)                  │
│  • dotenv (Environment Variables)                     │
└────────────────────────────────────────────────────────┘
```

**Row 2: API Routes** (Draw as a table)
```
┌─────────────────────────────────────────────────────────────────┐
│                        API ENDPOINTS                            │
├──────────────────┬──────────────────────────────────────────────┤
│  /api/auth       │  • POST /register (Create account)          │
│                  │  • POST /login (Authenticate user)          │
├──────────────────┼──────────────────────────────────────────────┤
│  /api/           │  • GET / (List all)                         │
│  appointments    │  • POST / (Create new)                      │
│  (Protected)     │  • GET /:id (Get single)                    │
│                  │  • PUT /:id (Update)                        │
│                  │  • DELETE /:id (Remove)                     │
├──────────────────┼──────────────────────────────────────────────┤
│  /api/users      │  • GET / (List users)                       │
│  (Protected)     │  • GET /:id (Get user)                      │
│                  │  • PUT /:id (Update user)                   │
│                  │  • DELETE /:id (Delete user)                │
├──────────────────┼──────────────────────────────────────────────┤
│  /api/treatments │  • CRUD operations                          │
│  /api/payments   │  • CRUD operations                          │
│  /api/           │  • CRUD operations                          │
│  notifications   │                                             │
└──────────────────┴──────────────────────────────────────────────┘
```

**Row 3: Controllers** (6 boxes)
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│auth         │ │appointment  │ │user         │ │treatment    │ │payment      │ │notification │
│Controller   │ │Controller   │ │Controller   │ │Controller   │ │Controller   │ │Controller   │
│             │ │             │ │             │ │             │ │             │ │             │
│• register   │ │• create     │ │• getAll     │ │• create     │ │• process    │ │• send       │
│• login      │ │• getAll     │ │• getById    │ │• update     │ │• getBalance │ │• getAll     │
│• genToken   │ │• update     │ │• update     │ │• delete     │ │• history    │ │• markRead   │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

**Row 4: Business Logic**
```
┌────────────────────────────────────────────────────────┐
│  Business Logic & Security Layer                       │
│                                                        │
│  • Input Validation & Sanitization                    │
│  • Password Hashing (bcryptjs - 10 salt rounds)       │
│  • JWT Token Generation (30-day expiration)           │
│  • JWT Token Verification                             │
│  • Role-Based Access Control (RBAC)                   │
│  • Error Handling & Logging                           │
└────────────────────────────────────────────────────────┘
```

---

## 📊 Layer 3: DATA LAYER (Bottom Third)

### Box Specifications:
- **Color**: Light Orange (#FFF3E0)
- **Border**: Dark Orange (#F57C00), 3px
- **Position**: Bottom of diagram, full width
- **Height**: 30% of canvas

### Header:
```
┌─────────────────────────────────────────────────────────────────┐
│  DATA LAYER (Database)                                          │
│  Technology: MongoDB + Mongoose ODM                             │
│  Connection: MongoDB Atlas (Cloud) or Local MongoDB             │
└─────────────────────────────────────────────────────────────────┘
```

### Components to Draw:

**Row 1: Database Connection**
```
┌────────────────────────────────────────────────────────┐
│  MongoDB Database                                      │
│  🍃 MongoDB v9.1.5 (Mongoose)                          │
│                                                        │
│  Connection String:                                    │
│  mongodb+srv://user:pass@cluster0.mongodb.net/         │
│  dentalalign?retryWrites=true&w=majority               │
│                                                        │
│  Database Name: dentalalign                            │
└────────────────────────────────────────────────────────┘
```

**Row 2: Collections/Models** (5 boxes with schemas)
```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ 👤 Users         │ │ 📅 Appointments  │ │ 💊 Treatments    │ │ 💳 Payments      │ │ 🔔 Notifications │
│                  │ │                  │ │                  │ │                  │ │                  │
│ • _id            │ │ • _id            │ │ • _id            │ │ • _id            │ │ • _id            │
│ • fullName       │ │ • patient (ref)  │ │ • patient (ref)  │ │ • appointment    │ │ • user (ref)     │
│ • email (unique) │ │ • dentist (ref)  │ │ • dentist (ref)  │ │ • amount         │ │ • message        │
│ • password       │ │ • date           │ │ • diagnosis      │ │ • method         │ │ • type           │
│   (hashed)       │ │ • time           │ │ • treatment      │ │ • status         │ │ • isRead         │
│ • phone          │ │ • service        │ │ • notes          │ │ • date           │ │ • createdAt      │
│ • role           │ │ • status         │ │ • prescription   │ │ • createdAt      │ │                  │
│   (patient/      │ │   (pending/      │ │ • createdAt      │ │                  │ │                  │
│    dentist/      │ │    confirmed/    │ │                  │ │                  │ │                  │
│    admin/staff)  │ │    completed/    │ │                  │ │                  │ │                  │
│ • slmcNumber     │ │    cancelled)    │ │                  │ │                  │ │                  │
│ • specialization │ │ • notes          │ │                  │ │                  │ │                  │
│ • createdAt      │ │ • createdAt      │ │                  │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## 🔐 SECURITY PANEL (Right Side)

### Box Specifications:
- **Color**: Light Purple (#F3E5F5)
- **Border**: Dark Purple (#7B1FA2), 3px
- **Position**: Right side, spanning all layers
- **Width**: 20% of canvas

### Content:
```
┌─────────────────────────────┐
│   🔐 SECURITY MECHANISMS    │
├─────────────────────────────┤
│                             │
│  🔑 Authentication          │
│  ─────────────────          │
│  • JWT (JSON Web Token)     │
│  • Token Expiry: 30 days    │
│  • Storage: localStorage    │
│  • Header: Authorization    │
│    Bearer <token>           │
│                             │
│  🔒 Password Security       │
│  ─────────────────          │
│  • bcryptjs v3.0.3          │
│  • Salt Rounds: 10          │
│  • Pre-save hashing         │
│  • Secure comparison        │
│                             │
│  🛡️ Authorization           │
│  ─────────────────          │
│  • Role-Based Access        │
│  • Protected Routes         │
│  • Middleware Verification  │
│  • User Roles:              │
│    - Patient                │
│    - Dentist                │
│    - Admin                  │
│    - Staff                  │
│                             │
│  🌐 CORS                    │
│  ─────────────────          │
│  • Cross-Origin Enabled     │
│  • Secure Headers           │
│  • Credentials Support      │
│                             │
│  ✅ Input Validation        │
│  ─────────────────          │
│  • Email format check       │
│  • Required fields          │
│  • Data sanitization        │
│                             │
└─────────────────────────────┘
```

---

## ➡️ DATA FLOW ARROWS

### Draw these arrows connecting the layers:

**1. Frontend → Backend (Blue Arrows, pointing down)**
```
Location: Between Presentation Layer and Application Layer
Label: "HTTP/HTTPS Requests (JSON)"
Examples:
  • POST /api/auth/login
  • GET /api/appointments
  • PUT /api/users/:id
```

**2. Backend → Frontend (Green Arrows, pointing up)**
```
Location: Between Application Layer and Presentation Layer
Label: "HTTP Responses (JSON)"
Examples:
  • { user, token }
  • { appointments: [...] }
  • { success: true }
```

**3. Backend → Database (Orange Arrows, pointing down)**
```
Location: Between Application Layer and Data Layer
Label: "Mongoose ODM Queries"
Examples:
  • User.findOne({ email })
  • Appointment.create({ ... })
  • User.findByIdAndUpdate(id, data)
```

**4. Database → Backend (Purple Arrows, pointing up)**
```
Location: Between Data Layer and Application Layer
Label: "Query Results (Documents)"
Examples:
  • User document
  • Appointment array
  • Updated document
```

---

## 🎯 EXAMPLE DATA FLOW (Draw as numbered sequence)

### User Login Flow (Draw this as a separate flow diagram on the side):

```
┌─────────┐
│ 1. User │ Enters email & password
│ Browser │
└────┬────┘
     │
     ▼
┌─────────────┐
│ 2. React    │ axios.post('/api/auth/login', { email, password })
│ LoginPage   │
└──────┬──────┘
       │ HTTP POST
       ▼
┌──────────────┐
│ 3. Express   │ Route: /api/auth/login
│ Server       │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ 4. authController│ loginUser(req, res)
│                  │ • Validate input
└──────┬───────────┘
       │
       ▼
┌──────────────┐
│ 5. MongoDB   │ User.findOne({ email: req.body.email })
│ Query        │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 6. bcrypt    │ comparePassword(inputPassword, user.password)
│ Verification │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 7. JWT       │ generateToken(user._id)
│ Generation   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 8. Response  │ res.json({ user, token })
│              │
└──────┬───────┘
       │ HTTP 200 OK
       ▼
┌──────────────┐
│ 9. React     │ localStorage.setItem('token', token)
│ App          │ Navigate to dashboard
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 10. User     │ Sees Dashboard
│ Dashboard    │
└──────────────┘
```

---

## 🎨 COLOR LEGEND (Draw at bottom)

```
┌────────────────────────────────────────────────────────┐
│  COLOR LEGEND                                          │
├────────────────────────────────────────────────────────┤
│  🔵 Blue    → Frontend/Client-Side                     │
│  🟢 Green   → Backend/Server-Side                      │
│  🟠 Orange  → Database/Data Storage                    │
│  🟣 Purple  → Security Components                      │
│  ➡️ Arrows  → Data Flow Direction                      │
└────────────────────────────────────────────────────────┘
```

---

## 📏 TECHNOLOGY STACK SUMMARY (Draw at top-right corner)

```
┌─────────────────────────────┐
│  TECHNOLOGY STACK           │
├─────────────────────────────┤
│  Frontend:                  │
│  • React 19.2.0             │
│  • Vite 7.2.4               │
│  • TailwindCSS 4.1.18       │
│  • React Router DOM 7.13.0  │
│  • Axios 1.13.4             │
│                             │
│  Backend:                   │
│  • Node.js (ES Modules)     │
│  • Express.js 5.2.1         │
│  • Mongoose 9.1.5           │
│  • bcryptjs 3.0.3           │
│  • jsonwebtoken 9.0.3       │
│  • CORS 2.8.6               │
│  • dotenv 17.2.3            │
│                             │
│  Database:                  │
│  • MongoDB Atlas (Cloud)    │
│  • MongoDB Community (Local)│
│                             │
│  Development:               │
│  • Nodemon 3.1.11           │
│  • ESLint 9.39.1            │
└─────────────────────────────┘
```

---

## ✅ DRAWING CHECKLIST

Use this checklist when creating your diagram:

- [ ] Canvas is landscape orientation, HD quality
- [ ] Title "DentAlign - 3-Tier MERN Architecture" at top
- [ ] Three main layers clearly separated (Presentation, Application, Data)
- [ ] Each layer has distinct background color
- [ ] All components within layers are properly labeled
- [ ] Security panel on the right side
- [ ] Arrows showing data flow between layers
- [ ] Arrow labels indicate data type (JSON, Queries, etc.)
- [ ] Technology stack summary included
- [ ] Color legend at bottom
- [ ] Example data flow diagram (Login) included
- [ ] All text is legible and professional
- [ ] Consistent spacing and alignment
- [ ] Technology logos/icons where appropriate
- [ ] Port numbers clearly marked (5173, 5000)
- [ ] Database collections with schema details
- [ ] API endpoints with HTTP methods
- [ ] Security mechanisms detailed

---

## 🛠️ RECOMMENDED TOOLS

**Online (Free):**
- draw.io (diagrams.net) - Best for technical diagrams
- Lucidchart - Professional diagramming
- Canva - Easy to use with templates

**Desktop:**
- Microsoft Visio - Professional standard
- Microsoft PowerPoint - Simple and accessible
- Adobe Illustrator - High-quality graphics

**Code-Based:**
- PlantUML - Text-to-diagram
- Mermaid.js - Markdown diagrams

---

## 📸 EXPORT SETTINGS

When exporting your diagram:
- **Format**: PNG or PDF
- **Resolution**: 300 DPI minimum
- **Size**: 1920x1080px or A4 landscape
- **Quality**: Maximum/High
- **Background**: White or transparent

---

**Good luck with your architecture diagram! This will impress your professors! 🎓✨**

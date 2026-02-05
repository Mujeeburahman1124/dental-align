# 🚀 DentAlign - Quick Start Guide

This guide will help you set up and run the DentAlign dental management system in minutes.

---

## 📋 Prerequisites

- **Node.js**: v14.0.0 or higher
- **MongoDB**: Access to MongoDB Atlas (Already Configured!)

---

## 🚀 How to Run the Project

You need to run **two terminal commands** in separate windows: one for the Backend (Server) and one for the Frontend (React App).

### 1️⃣ Start the Backend Server
This handles the database and API.

1. Open a terminal in the project folder.
2. Run the following command:
   ```bash
   npm run server
   ```
3. You should see:
   - `Server running on port 5000`
   - `MongoDB Connected`

### 2️⃣ Start the Frontend Application
This launches the website.

1. Open a **SECOND** terminal in the project folder.
2. Run the following command:
   ```bash
   npm run dev
   ```
3. You should see:
   - `Local: http://localhost:5173/`

---

## 🌐 Accessing the App

Open your browser and click this link:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Login Credentials (Pre-Created)

We have already seeded the database with these test accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@dentalalign.com` | `admin` |
| **Dentist** | `dentist@dentalalign.com` | `dentist` |
| **Patient** | `patient@dentalalign.com` | `patient` |

---

## 🛑 Identifying Issues

- **If the login says "Network Error"**: Make sure the Backend Server (`npm run server`) is running.
- **If the database won't connect**: Check your internet connection (Atlas is a cloud database).

---

## 🛠️ Project Structure

- **Frontend**: Runs on Port `5173` (Vite)
- **Backend API**: Runs on Port `5000` (Node/Express)
- **Database**: MongoDB Atlas (Cloud)

Enjoy using DentAlign! 🦷✨

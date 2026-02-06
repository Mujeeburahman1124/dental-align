# 🚀 How to Run DentAlign Project

## ✅ Current Status

Your project has 2 parts that need to run simultaneously:

1. **Backend Server** (Port 5000) - Handles database and API
2. **Frontend App** (Port 5173) - The website interface

---

## 📋 Quick Start (2 Steps)

### Step 1: Start Backend Server

Open a terminal in the project folder and run:

```powershell
npm run server
```

**Expected Output:**
```
[nodemon] 3.1.11
[nodemon] to restart at any time, type `rs`
[nodemon] starting `node server/index.js`
🚀 Server running on port 5000
📍 API URL: http://localhost:5000
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

**If you see "MongoDB Connection Error":**
- Check your internet connection (MongoDB Atlas is cloud-based)
- Verify the `.env` file in the `server` folder has correct credentials
- See troubleshooting section below

---

### Step 2: Start Frontend Application

Open a **SECOND** terminal (keep the first one running) and run:

```powershell
npm run dev
```

**Expected Output:**
```
VITE v7.3.1  ready in 734 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

---

## 🌐 Access the Application

Once both servers are running, open your browser and go to:

👉 **http://localhost:5173/**

You should see the DentAlign landing page!

---

## 🔧 Troubleshooting

### Problem 1: MongoDB Connection Failed

**Symptoms:**
```
MongoDB Connection Error: Could not connect to any servers
```

**Solutions:**

**Option A: Use MongoDB Atlas (Cloud - Recommended)**

1. Check your internet connection
2. Verify `server/.env` file has correct MongoDB URI
3. Make sure IP address is whitelisted in MongoDB Atlas:
   - Go to MongoDB Atlas → Network Access
   - Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

**Option B: Use Local MongoDB**

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
3. Update `server/.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/dentalalign
   ```

---

### Problem 2: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

Kill the process using the port:

```powershell
# Find the process
netstat -ano | findstr :5000

# Kill it (replace PID with the number from above)
taskkill /PID <PID> /F
```

Or change the port in `server/.env`:
```env
PORT=5001
```

---

### Problem 3: Frontend Shows Blank Page

**Solutions:**

1. Check browser console (Press F12)
2. Make sure you ran `npm install` first
3. Clear browser cache (Ctrl + Shift + Delete)
4. Try incognito mode

---

### Problem 4: Cannot Login/Register

**Symptoms:**
- "Network Error" message
- "Something went wrong"

**Solutions:**

1. **Make sure backend is running!** Check terminal 1
2. Verify backend is accessible:
   - Open browser: http://localhost:5000/api/health
   - Should see: `{"status":"ok","message":"DentAlign API is running!"}`
3. Check browser console for error messages

---

## 🧪 Test the Setup

### Test 1: Check Backend Health

Open browser and go to:
```
http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "DentAlign API is running!"
}
```

### Test 2: Check Frontend

Open browser and go to:
```
http://localhost:5173/
```

You should see the DentAlign landing page with:
- Navigation bar
- Hero section
- Features section
- Footer

### Test 3: Test Registration

1. Click "Get Started" or "Sign Up"
2. Fill in the registration form
3. Click "Register"
4. If successful, you'll be redirected to the dashboard

---

## 🛑 How to Stop the Project

### Stop Backend:
- Go to the terminal running `npm run server`
- Press `Ctrl + C`

### Stop Frontend:
- Go to the terminal running `npm run dev`
- Press `Ctrl + C`

---

## 📱 Default Test Accounts

If you've seeded the database, you can use these accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@dentalalign.com | admin |
| **Dentist** | dentist@dentalalign.com | dentist |
| **Patient** | patient@dentalalign.com | patient |

---

## 🔄 Restart After Changes

### If you change backend code:
- Nodemon will auto-restart (no action needed)
- Or manually: Press `rs` in the backend terminal

### If you change frontend code:
- Vite will auto-reload (no action needed)
- Just save the file and check browser

### If you change `.env` file:
- Stop backend (Ctrl + C)
- Restart: `npm run server`

---

## 📊 What Each Terminal Should Show

### Terminal 1 (Backend):
```
[nodemon] 3.1.11
[nodemon] to restart at any time, type `rs`
[nodemon] starting `node server/index.js`
[dotenv@17.2.3] injecting environment variables from .env file
🚀 Server running on port 5000
📍 API URL: http://localhost:5000
✅ MongoDB Connected: cluster0.8dpyyw2.mongodb.net
```

### Terminal 2 (Frontend):
```
VITE v7.3.1  ready in 734 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

---

## 🎯 Complete Startup Checklist

- [ ] Opened terminal in project folder
- [ ] Ran `npm run server` in terminal 1
- [ ] Saw "MongoDB Connected" message
- [ ] Opened second terminal
- [ ] Ran `npm run dev` in terminal 2
- [ ] Saw "Local: http://localhost:5173/" message
- [ ] Opened browser to http://localhost:5173/
- [ ] Saw DentAlign landing page
- [ ] Tested registration/login
- [ ] Both terminals still running

---

## 💡 Pro Tips

1. **Keep both terminals visible** - Use split screen or tabs
2. **Check terminal output** - Errors will show here first
3. **Use browser DevTools** - Press F12 to see console errors
4. **Test API directly** - Use http://localhost:5000/api/health
5. **Save often** - Vite auto-reloads on save

---

## 🆘 Still Having Issues?

1. **Check Prerequisites:**
   - Node.js installed? Run: `node --version`
   - npm installed? Run: `npm --version`
   - Dependencies installed? Run: `npm install`

2. **Fresh Start:**
   ```powershell
   # Stop all terminals (Ctrl + C)
   # Delete node_modules
   Remove-Item -Recurse -Force node_modules
   
   # Reinstall
   npm install
   
   # Start again
   npm run server  # Terminal 1
   npm run dev     # Terminal 2
   ```

3. **Check the logs:**
   - Backend errors: Check terminal 1
   - Frontend errors: Check browser console (F12)
   - Network errors: Check browser Network tab (F12)

---

**Good luck! Your project should be running smoothly now! 🚀**

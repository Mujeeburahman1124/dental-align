# 🔧 Fix MongoDB Atlas Connection Issue

## ❌ Current Problem
Your backend server cannot connect to MongoDB Atlas. This is usually because your IP address is not whitelisted.

---

## ✅ Solution: Whitelist Your IP Address

### Step 1: Go to MongoDB Atlas
Open this link in your browser:
👉 **https://cloud.mongodb.com/**

### Step 2: Navigate to Network Access
1. Click on **"Network Access"** in the left sidebar (under SECURITY section)
2. You should see the Network Access page

### Step 3: Add IP Address
1. Click the **"+ ADD IP ADDRESS"** button (green button on the right)
2. A dialog will appear with two options:

   **Option A: Allow Access from Anywhere (Recommended for Development)**
   - Click **"ALLOW ACCESS FROM ANYWHERE"**
   - This will add `0.0.0.0/0` to the whitelist
   - Click **"Confirm"**
   
   **Option B: Add Your Current IP Address**
   - Click **"ADD CURRENT IP ADDRESS"**
   - It will auto-detect your IP
   - Click **"Confirm"**

### Step 4: Wait for Changes to Apply
- The status will show "Pending" for a few seconds
- Wait until it shows "Active" (usually 1-2 minutes)

### Step 5: Restart Your Backend Server
1. Go to the terminal running `npm run server`
2. Press `Ctrl + C` to stop it
3. Run again: `npm run server`
4. You should now see: `✅ MongoDB Connected`

---

## 🎯 Expected Success Output

After fixing, your backend terminal should show:

```
[nodemon] 3.1.11
[nodemon] to restart at any time, type `rs`
[nodemon] starting `node server/index.js`
[dotenv@17.2.3] injecting environment variables from .env file
🚀 Server running on port 5000
📍 API URL: http://localhost:5000
✅ MongoDB Connected: cluster0.8dpyyw2.mongodb.net
```

---

## 🔍 Verify Connection

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

### Test 2: Check Database Connection
Run this command in a new terminal:
```powershell
node server/test-db-connection.js
```

Expected output:
```
⏳ Testing MongoDB Atlas Connection...
🔗 Target Host: cluster0.8dpyyw2.mongodb.net
✅ MongoDB Connected Successfully!
🏠 Host: cluster0-shard-00-02.8dpyyw2.mongodb.net
🗄️  Database: dentalalign
👋 Disconnected cleanly.
```

---

## 🚨 Alternative: Check Current Settings

### Verify Your Database User
1. In MongoDB Atlas, go to **"Database Access"**
2. Make sure you have a user: `dentalalign_db_user`
3. Password should match what's in your `server/.env` file
4. Role should be: **"Read and write to any database"** or **"Atlas admin"**

### Verify Your Connection String
Your `server/.env` file should have:
```env
MONGO_URI=mongodb+srv://dentalalign_db_user:KCKzrlAOij0viwMZ@cluster0.8dpyyw2.mongodb.net/dentalalign?retryWrites=true&w=majority&appName=Cluster0
```

Make sure:
- ✅ Username is correct: `dentalalign_db_user`
- ✅ Password is correct: `KCKzrlAOij0viwMZ`
- ✅ Cluster address is correct: `cluster0.8dpyyw2.mongodb.net`
- ✅ Database name is: `dentalalign`

---

## 📸 Visual Guide

### Where to Find Network Access:
```
MongoDB Atlas Dashboard
├── SECURITY (left sidebar)
│   ├── Database Access ← (Users are here)
│   └── Network Access  ← (IP Whitelist is here) ⭐ GO HERE
```

### What to Click:
```
Network Access Page
├── [+ ADD IP ADDRESS] ← Click this green button
│   ├── Add Current IP Address
│   └── Allow Access from Anywhere ← Choose this for development
```

---

## ⚡ Quick Fix Checklist

- [ ] Opened MongoDB Atlas (cloud.mongodb.com)
- [ ] Logged in to your account
- [ ] Clicked "Network Access" in left sidebar
- [ ] Clicked "+ ADD IP ADDRESS" button
- [ ] Selected "ALLOW ACCESS FROM ANYWHERE"
- [ ] Clicked "Confirm"
- [ ] Waited for status to show "Active"
- [ ] Stopped backend server (Ctrl + C)
- [ ] Restarted backend: `npm run server`
- [ ] Saw "MongoDB Connected" message
- [ ] Tested http://localhost:5000/api/health

---

## 🎉 Once Fixed

After MongoDB connects successfully:

1. **Backend Terminal** should show:
   ```
   ✅ MongoDB Connected: cluster0.8dpyyw2.mongodb.net
   🚀 Server running on port 5000
   ```

2. **Frontend Terminal** should show:
   ```
   ➜  Local:   http://localhost:5173/
   ```

3. **Open Browser** to:
   ```
   http://localhost:5173/
   ```

4. **Test Registration:**
   - Click "Get Started"
   - Fill in the form
   - Register as a Patient
   - You should be redirected to the dashboard!

---

**Good luck! This should fix your MongoDB connection! 🚀**

# 🔑 How to Access Staff Dashboard

## 📍 **Staff Dashboard Location:**

**URL:** `http://localhost:5173/staff/dashboard`

**File:** `src/pages/staff/StaffDashboard.jsx`

---

## 🚪 **How to Access:**

### **Option 1: Login as Staff (Recommended)**

1. **Go to:** http://localhost:5173/login
2. **Select Role:** Click "I AM A Patient" → Select **"Staff"**
3. **Create Staff Account:**
   - Click "Create Account" tab
   - Fill in details
   - Select **"Staff"** as role
   - Click "Register"
4. **Login:**
   - Email: (your staff email)
   - Password: (your staff password)
   - Role: **Staff**
   - Click "Sign In"

### **Option 2: Direct URL (If Already Logged In)**

Simply navigate to: `http://localhost:5173/staff/dashboard`

---

## 📝 **Creating a Staff Account:**

Since there's no pre-seeded staff account, you need to register one:

### **Step-by-Step:**

1. **Open:** http://localhost:5173/register
2. **Fill the form:**
   ```
   Full Name: Staff Member
   Email: staff@dentalalign.com
   Phone: 0771234567
   Password: staff
   Role: Staff (select from dropdown)
   ```
3. **Click "Register"**
4. **You'll be redirected to Staff Dashboard!**

---

## 🎯 **Staff Dashboard Features:**

Once logged in, you'll see:

✅ **Stats Cards:**
- Today's Visits
- Pending Confirmations
- Total Patients

✅ **Quick Actions:**
- Appointments
- Patients
- Billing
- Walk-in

✅ **Appointment Queue:**
- List of all appointments
- Confirm pending appointments
- Generate bills for completed visits

✅ **Revenue Card:**
- Today's revenue display

---

## 🔐 **Login Credentials Summary:**

| Role | Email | Password | Status |
|------|-------|----------|--------|
| **Patient** | `patient@dentalalign.com` | `patient` | ✅ Pre-seeded |
| **Dentist** | `dentist@dentalalign.com` | `dentist` | ✅ Pre-seeded |
| **Admin** | `admin@dentalalign.com` | `admin` | ✅ Pre-seeded |
| **Staff** | Create via Register | - | ⚠️ Need to create |

---

## 🚀 **Quick Test:**

### **Create Staff Account Now:**

1. Open: http://localhost:5173/register
2. Use these details:
   ```
   Full Name: John Staff
   Email: staff@dentalalign.com
   Phone: 0771234567
   Password: staff
   Role: Staff
   ```
3. Click "Register"
4. You'll be at: http://localhost:5173/staff/dashboard

---

## 📱 **Staff Dashboard is Mobile-Responsive:**

✅ Compact design
✅ Touch-friendly buttons
✅ Responsive grid (2 cols mobile → 4 cols desktop)
✅ Mobile-optimized invoice modal
✅ Works on all devices

---

## 🎨 **What You'll See:**

### **Desktop View:**
- 3-column stats
- 4-column quick actions
- Full appointment queue
- Revenue card

### **Mobile View:**
- 2-column stats
- 2-column quick actions
- Stacked appointment cards
- Compact revenue card

---

## 💡 **Troubleshooting:**

### **"Can't find Staff Dashboard"**
- Make sure you're logged in as Staff role
- Check URL: http://localhost:5173/staff/dashboard
- Verify you selected "Staff" during registration

### **"No appointments showing"**
- This is normal if no appointments exist
- Create appointments as a Patient first
- Then login as Staff to manage them

### **"Can't register as Staff"**
- Make sure you select "Staff" from role dropdown
- Check that all fields are filled
- Verify backend is running (npm run server)

---

## ✅ **All Dashboard URLs:**

| Role | Dashboard URL |
|------|---------------|
| **Patient** | http://localhost:5173/patient/dashboard |
| **Dentist** | http://localhost:5173/dentist/dashboard |
| **Admin** | http://localhost:5173/admin/dashboard |
| **Staff** | http://localhost:5173/staff/dashboard |

---

**The Staff Dashboard is ready and optimized! Just create a staff account to access it.** 🚀

# 💳 DentAlign Payment System - User Guide

## 📋 Overview

The DentAlign system has a comprehensive payment system for handling two types of payments:

1. **Booking Fees** - Advance payment for appointments (Rs. 500 default)
2. **Treatment Fees** - Payment for completed dental treatments

---

## 🎯 How to Pay for Treatments

### **Method 1: Through the Billing Page (Recommended)**

#### Step 1: Access the Billing Page

**For Patients:**
1. Login to your account
2. Go to your **Patient Dashboard**
3. Click on **"Finance Hub"** or **"Billing"** in the navigation menu
4. Or directly visit: `http://localhost:5173/billing`

#### Step 2: View Pending Payments

You'll see two sections:

**📅 Pre-Treatment Booking Fees**
- Lists all appointments with unpaid booking fees
- Shows appointment date, time, and reason
- Default fee: Rs. 500 per appointment

**🦷 Post-Treatment Service Invoices**
- Lists all completed treatments that haven't been paid
- Shows treatment name, date, and dentist
- Shows actual treatment cost

#### Step 3: Make a Payment

1. **Choose what to pay:**
   - Click **"Pay Fee"** button for booking fees (blue button)
   - Click **"Settle Bill"** button for treatment costs (orange button)

2. **Payment Modal Opens:**
   - Review payment details
   - See the total amount due
   - Enter card information:
     - Card Number: `XXXX XXXX XXXX 4242`
     - Expiry: `MM / YY`
     - CVC: `XXX`

3. **Complete Payment:**
   - Click **"PROCEED & PAY NOW"**
   - Wait for authorization (shows "Authorizing...")
   - Success message appears with ✓ checkmark
   - Payment is recorded in your history

#### Step 4: View Payment History

1. Click the **"Payment History"** tab
2. See all completed payments with:
   - Transaction ID
   - Date processed
   - Payment method
   - Amount paid
   - Payment type (Booking Fee or Treatment Settlement)

---

## 💰 Payment Types Explained

### 1. Booking Fee Payment

**When:** Before your appointment  
**Amount:** Rs. 500 (default)  
**Purpose:** Secures your appointment slot  
**Status:** Must be paid to confirm appointment

**Flow:**
```
Book Appointment → Booking Fee Due → Pay Booking Fee → Appointment Confirmed
```

### 2. Treatment Fee Payment

**When:** After treatment is completed  
**Amount:** Varies based on treatment  
**Purpose:** Payment for dental services rendered  
**Status:** Must be paid to clear treatment invoice

**Flow:**
```
Complete Treatment → Treatment Invoice Generated → Pay Treatment Fee → Invoice Settled
```

---

## 🔍 Finding Your Payments

### **Dashboard Quick View:**
1. Login as Patient
2. On your dashboard, you'll see:
   - **Outstanding Balance** widget
   - **Recent Activity** showing payment notifications

### **Detailed Billing Page:**
1. Navigate to **Finance Hub** / **Billing**
2. See total outstanding at the top
3. View itemized list of:
   - Unpaid booking fees
   - Unpaid treatment costs
4. Access full payment history

---

## 📊 Payment Status Indicators

| Status | Meaning | Action Required |
|--------|---------|-----------------|
| **Due** | Payment not yet made | Click "Pay Fee" or "Settle Bill" |
| **Paid** | Payment completed | No action needed |
| **Completed** | Transaction successful | View in history |

---

## 🎨 Visual Guide

### **Billing Page Layout:**

```
┌─────────────────────────────────────────────────────┐
│  Finance Hub                    Total Outstanding   │
│  Pay for bookings and           Rs. 4,500           │
│  treatment records                                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  [💳 Required Payments]  [📜 Payment History]       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📅 Pre-Treatment Booking Fees                      │
│  ┌───────────────────────────────────────────────┐ │
│  │ 📅  Teeth Cleaning                            │ │
│  │     Feb 10, 2026 at 10:00 AM                  │ │
│  │                          Rs. 500  [Pay Fee]   │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  🦷 Post-Treatment Service Invoices                 │
│  ┌───────────────────────────────────────────────┐ │
│  │ 🦷  Root Canal Treatment                      │ │
│  │     Jan 26, 2026 • Dr. Muksith                │ │
│  │                       Rs. 4,000  [Settle Bill]│ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### **Payment Modal:**

```
┌─────────────────────────────────────────────────────┐
│  Secure Payment                              [×]    │
│  ADVANCE CONSULTATION FEE                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Description:  Teeth Cleaning                       │
│  Patient:      Your Name                            │
│  ─────────────────────────────────────────────      │
│  Total Due:    Rs. 500                              │
│                                                     │
│  💳 CREDIT / DEBIT CARD                             │
│  [XXXX XXXX XXXX 4242]                              │
│                                                     │
│  [MM / YY]              [CVC]                       │
│                                                     │
│  [PROCEED & PAY NOW]                                │
│                                                     │
│  💳 VISA  💳 MASTERCARD  |  PCI DSS SECURE          │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Security Features

✅ **PCI DSS Compliant** - Industry-standard security  
✅ **Encrypted Transactions** - All data encrypted  
✅ **Transaction IDs** - Unique ID for each payment  
✅ **Payment History** - Complete audit trail  
✅ **Secure Modal** - Protected payment interface  

---

## 📱 Step-by-Step Payment Process

### **Scenario: Paying for a Booking Fee**

1. **Login** as Patient
   ```
   Email: patient@dentalalign.com
   Password: patient
   ```

2. **Navigate to Billing**
   - Click "Finance Hub" in navigation
   - Or go to sidebar → "Billing"

3. **Find Your Appointment**
   - Look under "Pre-Treatment Booking Fees"
   - See your scheduled appointment

4. **Click "Pay Fee"**
   - Blue button on the right

5. **Review Details**
   - Check appointment details
   - Verify amount (Rs. 500)

6. **Enter Card Info** (Demo - any numbers work)
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`

7. **Click "PROCEED & PAY NOW"**
   - Wait for processing
   - See success message ✓

8. **Payment Complete!**
   - Booking fee marked as paid
   - Appointment confirmed
   - Receipt in payment history

---

## 🧪 Testing Payments (Development Mode)

For testing purposes, you can use these test card numbers:

| Card Type | Number | Expiry | CVC |
|-----------|--------|--------|-----|
| Visa | 4242 4242 4242 4242 | Any future date | Any 3 digits |
| Mastercard | 5555 5555 5555 4444 | Any future date | Any 3 digits |
| Generic | Any 16 digits | Any future date | Any 3 digits |

**Note:** In development mode, the payment is simulated and recorded in the database without actual charge.

---

## 📊 API Endpoints (For Developers)

### **Process Payment**
```
POST /api/payments
Headers: Authorization: Bearer <token>
Body: {
  "amount": 500,
  "paymentType": "booking_fee",
  "appointmentId": "...",
  "paymentMethod": "card"
}
```

### **Get Payment History**
```
GET /api/payments/my-payments
Headers: Authorization: Bearer <token>
```

### **Get Billing Summary**
```
GET /api/payments/summary
Headers: Authorization: Bearer <token>
Response: {
  "outstandingBalance": 4500,
  "bookingFeesDue": 500,
  "treatmentCostsDue": 4000,
  "unpaidCount": 2,
  "totalSpent": 1200
}
```

---

## 🎯 Common Scenarios

### **Scenario 1: New Patient Books Appointment**
1. Register as Patient
2. Book an appointment
3. Booking fee (Rs. 500) is created
4. Go to Billing page
5. Pay booking fee
6. Appointment is confirmed

### **Scenario 2: After Treatment Completion**
1. Dentist completes treatment
2. Dentist creates treatment record with cost
3. Treatment invoice appears in patient's billing
4. Patient goes to Billing page
5. Pays treatment fee
6. Invoice is settled

### **Scenario 3: Checking Payment History**
1. Login as Patient
2. Go to Finance Hub
3. Click "Payment History" tab
4. See all past payments with:
   - Transaction IDs
   - Dates
   - Amounts
   - Payment types

---

## ⚠️ Important Notes

1. **Booking Fees:**
   - Must be paid before appointment
   - Default: Rs. 500
   - Non-refundable (policy dependent)

2. **Treatment Fees:**
   - Charged after service completion
   - Amount set by dentist
   - Based on actual treatment provided

3. **Outstanding Balance:**
   - Shows total amount due
   - Includes both booking and treatment fees
   - Updated in real-time after payment

4. **Payment Notifications:**
   - Automatic notification after payment
   - Shows transaction ID
   - Confirms payment type and amount

---

## 🛠️ Troubleshooting

### **Problem: Can't see payment option**
**Solution:** 
- Make sure you're logged in as a Patient
- Check if you have pending appointments or treatments
- Refresh the page

### **Problem: Payment button not working**
**Solution:**
- Check internet connection
- Verify backend server is running (http://localhost:5000)
- Check browser console for errors (F12)

### **Problem: Payment not showing in history**
**Solution:**
- Wait a few seconds and refresh
- Check "Payment History" tab
- Verify payment was successful (look for success message)

---

## 📞 For Demonstration

### **Demo Flow for Presentation:**

1. **Show Billing Page:**
   - Login as patient
   - Navigate to Finance Hub
   - Point out total outstanding balance

2. **Demonstrate Booking Fee Payment:**
   - Show unpaid appointment
   - Click "Pay Fee"
   - Show payment modal
   - Enter test card details
   - Complete payment
   - Show success message

3. **Show Payment History:**
   - Switch to "Payment History" tab
   - Point out transaction details
   - Show transaction ID
   - Explain payment tracking

4. **Show Updated Balance:**
   - Return to dashboard
   - Show updated outstanding balance
   - Demonstrate real-time updates

---

## ✅ Payment System Features

✨ **User-Friendly Interface** - Clean, modern design  
✨ **Real-Time Updates** - Instant balance updates  
✨ **Secure Processing** - Encrypted transactions  
✨ **Complete History** - Full payment audit trail  
✨ **Multiple Payment Types** - Booking & treatment fees  
✨ **Transaction Tracking** - Unique IDs for each payment  
✨ **Notifications** - Automatic payment confirmations  
✨ **Responsive Design** - Works on all devices  

---

**Your payment system is fully functional and ready for demonstration! 🎉**

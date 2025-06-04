
# 🚪 InstantFix  
**Your Trusted Home Appliance Service Platform – Book AC Cleaning, Repairs & More at Your Doorstep**

---

## 🏡 About

**InstantFix** is a modern home service platform that seamlessly connects customers with certified technicians for cleaning, maintenance, and repair of home appliances — all from the comfort of your home. Whether it’s an AC, refrigerator, washing machine, or any other appliance, we ensure fast, reliable, and professional service.

---

## ✨ Key Features

- 🔧 **Wide Range of Services** – AC cleaning, fridge maintenance, washing machine repairs, and more  
- 👷 **Verified Technicians** – Thoroughly background-checked and trained professionals  
- 📱 **Easy Online Booking** – Schedule a service in just a few taps  
- 💳 **Multiple Payment Options** – Pay via UPI, credit/debit cards, or cash on delivery  
- 📍 **Live Technician Tracking** – Monitor real-time technician location and ETA  
- ⭐ **Ratings & Reviews** – Quality assurance through customer feedback  

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose ODM  
- **Authentication:** JWT + bcrypt  
- **Payments:** Razorpay & Stripe  
- **Notifications:** Email, SMS, Push Notifications  

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v18 or later)  
- MongoDB (local or cloud)  
- npm or yarn  

### 📥 Installation

```bash
git clone https://github.com/whomimohshukla/InstantFix
cd InstantFix
npm install
```

### 🔐 Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/InstantFix
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 🟢 Run the Application

```bash
# Development
npm run dev

# Production
npm start
```

---

## 📁 Project Structure

```
InstantFix/
├── models/            # Mongoose schemas
├── routes/            # Route handlers
├── controllers/       # Business logic and APIs
├── middleware/        # Auth, validation, etc.
├── config/            # Database and service configs
└── utils/             # Utility functions
```

---

## 📡 API Endpoints

### 🔐 Authentication

- `POST /api/auth/register` – Register a new user  
- `POST /api/auth/login` – User login  

### 🧰 Services

- `GET /api/services` – List all services  
- `GET /api/services/:id` – Service details  

### 🗓 Bookings

- `POST /api/bookings` – Book a service  
- `GET /api/bookings` – Get user bookings  
- `PUT /api/bookings/:id` – Update booking status  

### 💳 Payments

- `POST /api/payments/initiate` – Start payment  
- `POST /api/payments/verify` – Verify payment  

---

## 🧬 Mongoose Models Overview

### 📘 `User.js`
Stores user details, roles (customer, technician, admin), addresses, preferences, loyalty, devices, and security.  
Includes hashed passwords, verification, and referral tracking.

### 👷 `Technician.js`
Stores professional data, schedule, tools, location, skills, documents, earnings, and performance metrics.

### 🧰 `Service.js`
Manages service categories, pricing, appliance compatibility, media, and membership discounts.  
Also includes time estimates and SEO fields.

### 🗓 `Booking.js`
Handles full service lifecycle: customer, technician, time, address, pricing, status, feedback, and cancellation.

### 💳 `Payment.js`
Stores payment metadata, gateway info, refunds, amount breakdowns, and validation for Razorpay, Stripe, UPI, etc.

### 📍 `Tracking.js`
Tracks technician location (GPS), routes, geofencing, and live status updates.

### 🔔 `Notification.js`
Manages notifications by type, content, delivery channel, audience, and delivery status tracking.

### 🏷 `Coupon.js`
Manages discount codes, usage limits, targeted users/services, geo-filters, and history.

### 📦 `Inventory.js`
Stores stock data for tools/spare parts with compatibility, location, vendor, pricing, and reorder alerts.

### 📊 `Analytics.js`
Tracks booking, service, technician, financial, geographic, and customer KPIs on a daily/weekly/monthly basis.

---

## 🤝 Contributing

```bash
1. Fork the repo
2. Create a feature branch: git checkout -b feature/your-feature
3. Commit changes: git commit -m "Add your feature"
4. Push: git push origin feature/your-feature
5. Create a pull request 🚀
```

---

## 📄 License

Licensed under the [MIT License](LICENSE)

---

## 📞 Contact

For queries, feedback, or support:  
📧 [support@InstantFix.com](mailto:support@InstantFix.com)

---

**InstantFix** – Your trusted partner for fast, safe, and reliable appliance services right at your doorstep! 🛠️🏠✨

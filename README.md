# 🚪 InstantFix

**Your Trusted Home Appliance Service Platform – Book AC Cleaning, Repairs & More at Your Doorstep**

---

## 🏡 About

**InstantFix** is a modern home service platform that seamlessly connects customers with certified technicians for cleaning, maintenance, and repair of home appliances — all from the comfort of your home. Whether it’s an AC, refrigerator, washing machine, or any other appliance, we ensure fast, reliable, and professional service.

---

## ✨ Key Features

* 🔧 **Wide Range of Services** – AC cleaning, fridge maintenance, washing machine repairs, and more
* 👷 **Verified Technicians** – Thoroughly background-checked and trained professionals
* 📱 **Easy Online Booking** – Schedule a service in just a few taps
* 💳 **Multiple Payment Options** – Pay via UPI, credit/debit cards, or cash on delivery
* 📍 **Live Technician Tracking** – Monitor real-time technician location and ETA
* ⭐ **Ratings & Reviews** – Quality assurance through customer feedback

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose ODM
* **Authentication:** JWT + bcrypt
* **Payments:** Razorpay & Stripe integration
* **Notifications:** Email, SMS, and Push Notifications

---

## 🚀 Getting Started

### 📦 Prerequisites

* Node.js (v18 or later)
* MongoDB (local or cloud instance)
* npm or yarn

### 📥 Installation

1. **Clone the Repository**

```bash
git clone https://github.com/whomimohshukla/InstantFix
cd InstantFix
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/InstantFix
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

4. **Start the Application**

```bash
# For development
npm run dev

# For production
npm start
```

---

## 📁 Project Structure

```
InstantFix/
├── models/            # Mongoose schemas
│   ├── User.js
│   ├── Service.js
│   ├── Technician.js
│   ├── Booking.js
│   └── Payment.js
├── routes/            # Route handlers
├── controllers/       # Business logic and APIs
├── middleware/        # Auth, validation, etc.
├── config/            # Database and service configs
└── utils/             # Utility functions
```

---

## 📡 API Endpoints

### 🔐 Authentication

* `POST /api/auth/register` – Register a new user
* `POST /api/auth/login` – User login

### 🧰 Services

* `GET /api/services` – List all available services
* `GET /api/services/:id` – Get details of a specific service

### 🗓 Bookings

* `POST /api/bookings` – Create a new service booking
* `GET /api/bookings` – Get user-specific bookings
* `PUT /api/bookings/:id` – Update the status of a booking

### 💳 Payments

* `POST /api/payments/initiate` – Start a payment transaction
* `POST /api/payments/verify` – Verify and complete a payment


---

## 🤝 Contributing

We welcome contributions from the community:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m "Add awesome feature"`
4. Push to the branch: `git push origin feature/awesome-feature`
5. Open a pull request 🚀

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📞 Contact

For queries, feature requests, or support, please reach out at:
📧 **[support@InstantFix.com](mailto:support@doorstepfix.com)**

---

**InstantFix** – Your trusted partner for fast, safe, and reliable appliance services right at your doorstep! 🛠️🏠✨

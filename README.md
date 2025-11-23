
# 🚪 InstantFix  
**Your Trusted Home Appliance Service Platform – Book AC Cleaning, Repairs & More at Your Doorstep**

---

## 🏡 About

**InstantFix** is a modern home service platform that seamlessly connects customers with certified technicians for cleaning, maintenance, and repair of home appliances — all from the comfort of your home. Whether it’s an AC, refrigerator, washing machine, or any other appliance, we ensure fast, reliable, and professional service.

---

## ✨ Core Features

<<<<<<< HEAD
* 🔧 **Service Coverage** – AC, refrigeration, washing machines, RO, electricals, and more
* 👷 **Verified Pros** – Background checks, KYC, certifications, on-site check-in/out
* 📱 **Frictionless Booking** – Issue capture with media upload, preferred slot selection
* 💳 **Secure Payments** – UPI/cards/net-banking, refunds, and invoice generation
* 📍 **Live Tracking** – Real-time technician location, ETA updates, arrival notifications
* ⭐ **Ratings & Reviews** – Post-job feedback, dispute handling, quality assurance
* 🧾 **Transparent Pricing** – Itemized labor + parts estimate with price-lock option
* 🛠️ **Parts Handling** – Catalog, availability check, and reservation workflows
* 🔔 **Notifications** – Email/SMS/Push for booking, dispatch, arrival, and completion
=======
- 🔧 **Wide Range of Services** – AC cleaning, fridge maintenance, washing machine repairs, and more  
- 👷 **Verified Technicians** – Thoroughly background-checked and trained professionals  
- 📱 **Easy Online Booking** – Schedule a service in just a few taps  
- 💳 **Multiple Payment Options** – Pay via UPI, credit/debit cards, or cash on delivery  
- 📍 **Live Technician Tracking** – Monitor real-time technician location and ETA  
- ⭐ **Ratings & Reviews** – Quality assurance through customer feedback  
>>>>>>> 4666d8564353a932ff302a731ec644dcb5e38333

---

## 🤖 Advanced & AI Features

<<<<<<< HEAD
* 🧠 **AI Intake & Triage** – Image/video understanding to classify issues and severity
* 💰 **Dynamic Pricing** – AI estimates with confidence scores and human review fallback
* 📦 **Parts Intelligence** – Part recognition from images; nearby inventory lookup
* 🚚 **Smart Dispatch** – Ranking by skills, distance, acceptance probability, SLA fit
* 🗺️ **Route Optimization** – Live traffic-aware routing and batching for multiple jobs
* 🛡️ **Fraud & Trust** – Anomaly detection on jobs/payments; device and geo risk signals
* 🗣️ **AI Support Agent** – RAG over policies/KB; multilingual chat and safe escalation
* 📝 **Auto Summaries** – Job note summarization, warranty eligibility, upsell cues
* 📊 **Decisioning Loops** – Feedback collection to retrain pricing/dispatch models

---

## 🧰 Technologies Needed (Planned v2 Architecture)

* **Frontend:** Next.js (App Router, TypeScript), TailwindCSS
* **API:** Node.js (NestJS or Express + Zod), OpenAPI, RBAC middleware
* **Database:** Postgres (RDS) + Prisma ORM, PostGIS for geo, pgvector for embeddings
* **Caching:** Redis (ElastiCache) for sessions, cache, and pub/sub
* **Streaming:** Kafka (MSK) for events (jobs, pricing, dispatch, payments)
* **Storage/CDN:** S3 for media, CloudFront CDN
* **AI:** LLM/VLM providers, vector DB (pgvector/OpenSearch), guardrails layer
* **Payments:** Stripe (Payment Intents) and/or Razorpay
* **Infra:** Docker, AWS ECS Fargate (or EKS), Terraform IaC, GitHub Actions CI/CD
* **Observability:** OpenTelemetry, Prometheus/Grafana, CloudWatch, Sentry
* **Security:** AWS Secrets Manager/SSM, KMS encryption, WAF/Shield
=======
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose ODM  
- **Authentication:** JWT + bcrypt  
- **Payments:** Razorpay & Stripe  
- **Notifications:** Email, SMS, Push Notifications  
>>>>>>> 4666d8564353a932ff302a731ec644dcb5e38333

---

## 🚀 Getting Started

### 📦 Prerequisites

<<<<<<< HEAD
* Node.js (v18 or later)
* Postgres (local or cloud instance)
* Redis (for cache/sessions)
* Docker (optional for local stack)
* Kafka (optional for events in local dev)
* npm or yarn
=======
- Node.js (v18 or later)  
- MongoDB (local or cloud)  
- npm or yarn  
>>>>>>> 4666d8564353a932ff302a731ec644dcb5e38333

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
<<<<<<< HEAD
DATABASE_URL=postgresql://user:password@localhost:5432/instantfix?schema=public
JWT_SECRET=your_jwt_secret_key

# Redis & Kafka
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092

# Storage & Payments
AWS_REGION=ap-south-1
AWS_S3_BUCKET=instantfix-media
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
=======
MONGODB_URI=mongodb://localhost:27017/InstantFix
JWT_SECRET=your_jwt_secret
>>>>>>> 4666d8564353a932ff302a731ec644dcb5e38333
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

## 🚀 Enhancements to Stand Out

- **Instant AI Quote:** photo/video triage, price with confidence, human fallback.
- **Smart Dispatch:** match score on skills/geo/ratings; ETA guarantee with live map.
- **Parts Intelligence:** identify parts from media; reserve nearby inventory.
- **Trust & Safety:** background checks, on-site check-in/out, fraud scoring.
- **Remote Assist:** video call with AR overlay for simple fixes.
- **Pro Reliability:** surge-aware incentives, failover vendor networks.
- **Analytics:** SLA dashboards (time-to-quote/dispatch), cohort retention, A/B tests.

---

## 🌐 Website Flow Diagram

```mermaid
flowchart LR
  L[Landing/Home] --> S[Select Service]
  S --> B[Booking Form]
  B --> U[Upload Photos/Notes]
  U --> Q[Quote (MVP: fixed)]
  Q --> P[Payment Intent]
  P --> C[Booking Confirmed]
  C --> T[Technician Assignment]
  T --> ETA[Live ETA + Tracking]
  ETA --> WIP[Work In Progress]
  WIP --> D[Job Done]
  D --> R[Rate & Review]
  R --> H[History/Invoices]

  L --> A[Login/Signup] --> DSH[Dashboard]
  DSH --> H
  DSH --> "Support/Chat"
```

## 👥 Dashboards by Role

### Customer Dashboard
- **Bookings**
  - Create new booking
  - View upcoming/past bookings
  - Reschedule/cancel (within policy)
- **Live Tracking**
  - Technician ETA, contact, status updates
- **Payments**
  - Pay balance, download invoices
  - Save payment methods (if supported)
- **Media & Notes**
  - Upload issue photos/videos
- **Support**
  - Chat, FAQs, ticketing
- **Profile**
  - Addresses, preferences, notifications
- **Reviews**
  - Rate completed jobs, view history

### Technician Dashboard
- **Jobs**
  - Available jobs (accept/decline)
  - Today’s route and schedule
  - Job details, customer contact, notes
- **On-site Workflow**
  - Check-in/out
  - Add parts used
  - Mark statuses (enroute, arrived, completed)
  - Upload before/after media
- **Earnings**
  - Daily/weekly payouts, incentives
- **Profile & Compliance**
  - Skills, documents/KYC, background check status
  - Availability toggle (online/offline)
- **Support**
  - Ops chat, SOPs/guide access

### Admin/Ops Dashboard
- **Overview**
  - Metrics: new bookings, in-progress, completion rate, SLAs
- **Bookings**
  - Create/edit bookings, reassign technician
  - Escalations and disputes handling
- **Technicians**
  - Approvals, documents, ratings, service areas
- **Pricing & Catalog**
  - Manage categories/services, base prices
- **Payments**
  - Refunds, disputes, payout reconciliation
- **Notifications**
  - Broadcasts, templates, delivery status
- **Compliance & Fraud**
  - Flags, audit logs, device/geo checks
- **Content/KB**
  - Troubleshooting guides for AI/Support
- **Feature Flags**
  - Toggle experiments, rollout controls

## 🔐 Role Permissions (Summary)
- **Customer**
  - Create/manage own bookings, pay, track, review, manage addresses/profile
- **Technician**
  - View/accept assigned jobs, update job status, upload media, manage availability/profile, view earnings
- **Admin/Ops**
  - Manage all bookings, technicians, pricing, refunds, notifications, flags, and platform settings

## 🧭 Mermaid: Role Navigation Overview
```mermaid
flowchart TB
  subgraph Customer
    C1[Dashboard]
    C2[Book Service]
    C3[Track Order]
    C4[Payments & Invoices]
    C5[Reviews]
    C6[Profile & Addresses]
  end

  subgraph Technician
    T1[Job Queue]
    T2[Today's Schedule]
    T3[Job Detail & Status]
    T4[Earnings]
    T5[Availability]
    T6[Documents/KYC]
  end

  subgraph Admin_Ops
    A1[Ops Overview]
    A2[Bookings Admin]
    A3[Technicians Admin]
    A4[Pricing & Catalog]
    A5[Payments & Refunds]
    A6[Notifications]
    A7[Fraud/Compliance]
    A8[KB & Feature Flags]
  end
```

## 🔁 System Flow Touchpoints
- Booking creation → Payment intent → Confirmation → Dispatch → Live tracking → Completion → Review
- Admin override on assignment and pricing
- Technician status changes drive customer notifications
- Webhooks (payments) update booking/payment states

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

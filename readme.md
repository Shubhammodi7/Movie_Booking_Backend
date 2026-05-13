# 🍿 MOVIE BOOKING APP: The High-Performance Booking BACKEND

Welcome to the backend of **MOVIE BOOKING APP**, a robust, role-based marketplace for movie bookings. Built with the **MERN stack** (minus the 'R' for now, we're all about that logic!), this system handles everything from **Atomic Seat Reservations** to **Automated Revenue Analytics**.

## 🚀 The Tech Stack (The "Daily Grind" Toolkit)


![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

* **Runtime:** Node.js & Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Logging:** Winston & Morgan (Industry Standard)
* **Security:** JWT-based Auth + Role-Based Access Control (RBAC)
* **Logic:** Atomic transactions to prevent "double-booking" race conditions

---

## 🛠️ The API Roadmap

To book a ticket effectively, a user follows a logical journey from authentication to payment verification. Here is the serialized arrangement of your routes.

### 1. 👤 User Journey & Booking Flow

These APIs represent the end-to-end flow for a customer, starting from discovery to final booking.

#### **Phase A: Authentication & Profile**

* `POST /register` — Join the tribe.
* `POST /login` — Get your JWT token.
* `GET /profile` — See your stats.
* `PATCH /profile/update` — Glow up your profile.

#### **Phase B: Discovery (Finding a Show)**

* `GET /movies` — Search for a blockbuster.
* `GET /movies/:id` — Deep dive into movie details.
* `GET /:city/show/movie/:name` — Find where the action is in your city.
* `GET /show/:showId` — Check seat availability (Real-time).

#### **Phase C: Booking & Payment**

* `POST /` — **Reserve your spot** (locks seats in `PENDING` state).
* `POST /payment/verify` — **The Truth API** (Simulated verification with 1% failure logic).
* `GET /mine` — Your digital ticket stash.
* `PATCH //:id/cancel` — Change of plans? Release your seats.

---

### 2. 🎭 Theatre Owner APIs

Manage your cinema empire, schedules, and track that paper.

#### **Theatre Management**

* `POST /theatre` — Onboard your venue.
* `GET /theatre/mine` — Your theatre portfolio.
* `PATCH /theatre/:id` — Update amenities.
* `DELETE /theatre/:id` — Close down shop.

#### **Show Management**

* `POST /show` — Set the schedule.
* `PATCH /show/:id` — Tweak timings or pricing.
* `DELETE /show/:id` — Cancel a screening.

#### **Revenue & Validation**

* `GET /owner/theatre/revenue/all` — Global revenue overview.
* `GET /owner/theatre/revenue/:theatreId` — Theatre-specific earnings.
* `GET /owner/movie/revenue/:theatreId` — See which movie is the "Cash Cow."
* `GET /owner/booking/:bookingId` — Gatekeeper mode: Verify tickets at the door.

---

### 3. ⚡ Admin (System Owner) APIs

The "God View" for platform governance.

#### **Oversight**

* `GET /admin/users` — Manage the user base.
* `GET /admin/theatres/pending` — Approve the next big partner.
* `PATCH /admin/theatres/:id/toggle` — Grant or revoke theatre licenses.

#### **Global Content**

* `POST /movies` — Add new titles to the system.
* `PATCH /movies/:id` — Fix metadata typos.
* `DELETE /movies/:id` — Retire old titles.

---

## 🌟 The Golden Flow (Test this path!)

| Step | Action | API Endpoint | Why it's cool |
| --- | --- | --- | --- |
| **1** | **Join** | `POST /register` | Hashed passwords only! |
| **2** | **Enter** | `POST /login` | Secure JWT issuing. |
| **3** | **Explore** | `GET /movies/:id` | Rich metadata retrieval. |
| **4** | **Locate** | `GET /:city/show/movie/:name` | City-based filtering. |
| **5** | **Reserve** | `POST /` | **Atomic `$inc**` seat locking. |
| **6** | **Confirm** | `POST /payment/verify` | Handles failure & seat recovery. |

---

## 🧪 Hidden Engineering Gems

* **Simulated Gateway:** The `/payment/verify` route includes a **2-second network latency** and a **1% failure probability** to test system resilience.
* **Seat Recovery:** If payment fails, the system **automatically** returns seats to the inventory via an atomic database update.
* **Winston Logging:** No `console.log` here! Every error is tracked in `logs/error.log` for professional debugging.

## 🚧 Roadmap (What's Next?)

* [x] Role-Based Access Control (RBAC)
* [x] Revenue Aggregation Pipelines
* [x] Simulated Payment Verification
* [ ] **Upcoming:** Real-time seat maps with Socket.io.
* [ ] **Upcoming:** Redis caching for frequently searched movies.

---

### **Honest Note on Progress**

**What I Nailed:** The core transaction engine, complex revenue aggregations, and a fully functional simulated payment flow.
**What's for later:** Integrating a real SMS gateway for ticket confirmation and building the React frontend to match this powerhouse backend.

---

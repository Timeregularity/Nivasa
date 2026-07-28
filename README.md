# 🏡 Nivasa

<p align="center">
  <b>✨ AI-Powered Rental & Travel Planning Platform ✨</b><br>
  Discover stays • Book with confidence • Plan smarter
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22.19.0-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-4.19.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini AI">
</p>

> **Nivasa** is a full-stack rental-property platform where customers discover and book stays while property owners manage listings, availability, and booking requests. It combines a dependable booking workflow with Gemini-powered search, content generation, review insights, recommendations, and travel planning. ✈️

## ✨ Features

### 🔐 Authentication & access control

- User registration, login, logout, password hashing, and persistent MongoDB-backed sessions using Passport.js.
- Role-based accounts for **customers** and **property owners**.
- Protected routes and ownership checks for listing management, booking actions, availability blocking, and reviews.
- Redirects users back to their intended page after login, with flash messages for user feedback.

### 🏠 Property listings

- Create, browse, view, edit, and delete rental listings.
- Capture title, description, image, nightly price, location, country, and category.
- Upload listing images to Cloudinary through Multer.
- Browse curated categories including Trending, Rooms, Iconic Cities, Hills, Coastal, Camping, and Snow.
- Automatically remove associated reviews when a listing is deleted.

### 🔎 Search & discovery

- Search stays by city, country, or category.
- Location autocomplete powered by available listing data.
- AI natural-language property search that extracts destination, category, and price filters from conversational queries.
- Typo-tolerant search normalization with price shorthand handling (for example, `5k`) and safe MongoDB query construction.
- Similar-stay recommendations based on location, country, category, and price proximity.

### 📅 Booking & availability

- Customers can submit booking requests with check-in/check-out dates, guest count, and optional notes.
- Live availability checks and automatic stay-cost calculation in the booking interface.
- Server-side prevention of overlapping pending or confirmed bookings and blocked date ranges.
- Customer booking timeline with cancellation for pending and confirmed reservations.
- Owner controls to accept, reject, complete, or cancel bookings and block dates for a listing.
- Owner dashboard with listing count, pending and confirmed booking counts, booking revenue, blocked dates, and 30-day occupancy estimate.

### ⭐ Reviews & ratings

- Guests can leave a rating and review only after completing a stay.
- Enforces one review per completed booking.
- Displays individual feedback and average property ratings.
- Review authors and listing owners can remove reviews.

### 🤖 Gemini AI features

- Generate engaging property descriptions from listing details.
- Summarize guest-review themes into concise, neutral insights.
- Recommend similar properties to support booking decisions.
- Validate and normalize trip destinations before planning.
- Generate budget-aware, multi-day travel plans and surface matching Nivasa stays.

## 🛠️ Tech Stack

| Area | Technologies |
| --- | --- |
| 🎨 Frontend | EJS, HTML, CSS, JavaScript, Bootstrap, EJS-Mate |
| ⚙️ Backend | Node.js, Express.js |
| 🗄️ Database | MongoDB, Mongoose |
| 🔐 Authentication | Passport.js, Passport Local, Passport Local Mongoose |
| 🤖 AI | Google Gemini API (`@google/genai`) |
| ☁️ Media storage | Cloudinary, Multer, Multer Storage Cloudinary |
| ✅ Validation & sessions | Joi, Express Session, Connect Mongo, Connect Flash |

## 🧩 Architecture

The application follows an MVC-oriented structure:

```text
controllers/  Request handling and business logic
DBModels/     Mongoose schemas for users, listings, bookings, reviews, and blocked dates
routes/       REST-style Express routes
views/        Server-rendered EJS pages
public/       Client-side JavaScript, styles, and static assets
middlewares.js Authentication, authorization, and request validation
```

## 🚀 Local Setup

1. Clone the repository and enter the project folder.

   ```bash
   git clone <repository-url>
   cd Nivasa
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Create a `.env` file with the required configuration.

   ```env
   ATLASDB_URL=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   api_Cloud_Name=your_cloudinary_cloud_name
   api_Key=your_cloudinary_api_key
   api_Secret=your_cloudinary_api_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the application.

   ```bash
   npm start
   ```

5. Open `http://localhost:1000` in your browser.

## 💼 Resume Summary

Built **Nivasa**, an AI-powered full-stack rental and travel-planning platform using Node.js, Express, MongoDB, EJS, Cloudinary, Passport.js, and Gemini AI. Delivered role-based property management, secure booking and availability workflows, owner analytics, verified post-stay reviews, natural-language property search, AI content generation, review summaries, similar-stay recommendations, and budget-aware trip planning.

const express = require("express");
const router = express.Router();

const generateDescription = require("../controllers/prompt");
const { generateSearchFilters } = require("../controllers/nlpSearch");
const { getSimilarListings, summarizeReviews, createTripPlan } = require("../controllers/aiFeatures");

router.post("/generate-description", generateDescription);
router.post("/nlp-search", generateSearchFilters);
router.get("/listings/:id/similar", getSimilarListings);
router.post("/listings/:id/review-summary", summarizeReviews);

// A browser navigation sends GET; take visitors to the form instead of returning a 404.
router.get("/trip-plan", (req, res) => {
  res.redirect("/listings#tripPlanner");
});
router.post("/trip-plan", createTripPlan);

// AI endpoints are consumed by fetch(), so errors must be JSON rather than an HTML error page.
router.use((err, req, res, next) => {
  console.error("AI request failed:", err.message);
  const statusCode = err.statusCode || 500;
  const message = statusCode >= 500 ? "AI service is unavailable right now. Please try again." : err.message;
  res.status(statusCode).json({ success: false, message });
});

module.exports = router;

const express = require("express");
const router = express.Router();

const generateDescription = require("../controllers/prompt");
const { generateSearchFilters } = require("../controllers/nlpSearch");
const { getSimilarListings, summarizeReviews, createTripPlan } = require("../controllers/aiFeatures");

router.post("/generate-description", generateDescription);
router.post("/nlp-search", generateSearchFilters);
router.get("/listings/:id/similar", getSimilarListings);
router.post("/listings/:id/review-summary", summarizeReviews);
router.post("/trip-plan", createTripPlan);

module.exports = router;

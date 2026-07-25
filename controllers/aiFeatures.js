const mongoose = require("mongoose");
const ai = require("../config/gemini");
const Listing = require("../DBModels/listing");
const ExpressError = require("../utils/expressErrors");

function requiredText(value, field, maxLength = 120) {
  if (typeof value !== "string" || !value.trim()) throw new ExpressError(400, `${field} is required.`);
  return value.trim().slice(0, maxLength);
}

function safeNumber(value, field, { min = 1, max = 10000000 } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new ExpressError(400, `${field} must be between ${min} and ${max}.`);
  return number;
}

async function generateText(contents) {
  const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents });
  const text = response.text && response.text.trim();
  if (!text) throw new ExpressError(502, "AI did not return a response. Please try again.");
  return text;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseJsonResponse(text) {
  const json = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(json);
}

async function normalizeDestination(destination) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Validate this property-search destination: "${destination}".
Return JSON only with exactly these fields:
{"status":"valid|corrected|invalid","normalizedDestination":"","message":""}
Rules:
- valid: recognizable city, region, state, or country. Keep a clean standard name.
- corrected: an obvious typo or formatting error. Use the corrected standard name and briefly state the correction.
- invalid: not a geographic destination, random text, or too ambiguous to search. Explain what the user should enter.
- Never invent a destination. Do not use markdown or extra keys.`,
  });
  const result = parseJsonResponse(response.text || "");
  if (!["valid", "corrected", "invalid"].includes(result.status) || typeof result.normalizedDestination !== "string") {
    throw new ExpressError(502, "AI could not validate the destination. Please try again.");
  }
  return result;
}

exports.getSimilarListings = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ExpressError(400, "Invalid listing ID.");
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found.");
    const candidates = await Listing.find({
      _id: { $ne: listing._id },
      $or: [{ category: listing.category }, { location: { $regex: escapeRegex(listing.location), $options: "i" } }, { country: { $regex: escapeRegex(listing.country), $options: "i" } }],
    }).limit(12);
    const similarListings = candidates.map((item) => ({
      id: item._id, title: item.title, location: item.location, country: item.country,
      category: item.category, price: item.price, imageUrl: item.img && item.img.url,
    })).sort((a, b) => Math.abs(a.price - listing.price) - Math.abs(b.price - listing.price)).slice(0, 3);
    res.json({ success: true, similarListings });
  } catch (error) { next(error); }
};

exports.summarizeReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ExpressError(400, "Invalid listing ID.");
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) throw new ExpressError(404, "Listing not found.");
    if (!listing.reviews.length) throw new ExpressError(400, "There are no reviews to summarize yet.");
    const reviews = listing.reviews.slice(0, 30).map((review) => ({ rating: review.rating, comment: String(review.comment || "").slice(0, 500) }));
    const summary = await generateText(`Summarize these guest reviews for the property "${listing.title}". Write 2–4 short, neutral sentences. Mention recurring positives and concerns only when supported by reviews. Do not use markdown. Reviews: ${JSON.stringify(reviews)}`);
    res.json({ success: true, summary });
  } catch (error) { next(error); }
};

exports.createTripPlan = async (req, res, next) => {
  try {
    const requestedDestination = requiredText(req.body.destination, "Destination");
    const days = safeNumber(req.body.days, "Days", { min: 1, max: 30 });
    const travelers = safeNumber(req.body.travelers, "Travelers", { min: 1, max: 20 });
    const budget = safeNumber(req.body.budget, "Budget", { min: 500, max: 10000000 });
    const destinationCheck = await normalizeDestination(requestedDestination);
    if (destinationCheck.status === "invalid") {
      throw new ExpressError(400, destinationCheck.message || "Please enter a valid city, region, or country.");
    }
    const destination = destinationCheck.normalizedDestination.trim();
    const nightlyBudget = Math.floor(budget / days);
    const stays = await Listing.find({ $or: [{ location: { $regex: escapeRegex(destination), $options: "i" } }, { country: { $regex: escapeRegex(destination), $options: "i" } }], price: { $lte: nightlyBudget } }).limit(5);
    const stayData = stays.map((stay) => ({ title: stay.title, price: stay.price, location: stay.location, category: stay.category }));
    const plan = await generateText(`Create a concise ${days}-day travel outline for ${travelers} traveler(s) visiting ${destination} with a total budget of ₹${budget}. Suggest sensible activity types without inventing exact opening hours, bookings, or prices. Keep the answer under 180 words and do not use markdown. Available StayNest options within roughly ₹${nightlyBudget} per night: ${JSON.stringify(stayData)}`);
    res.json({ success: true, plan, destination, destinationMessage: destinationCheck.status === "corrected" ? destinationCheck.message : null, stays: stays.map((stay) => ({ id: stay._id, title: stay.title, price: stay.price })) });
  } catch (error) { next(error); }
};

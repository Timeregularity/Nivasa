const Listing = require("../DBModels/listing");
const ai = require("../config/gemini");
const ExpressError = require("../utils/expressErrors");

const CATEGORIES = ["Trending", "Rooms", "Iconic Cities", "Hills", "Coastal", "Camping", "Snow"];

function cleanText(value) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().slice(0, 80);
  return cleaned || null;
}

function cleanPrice(value) {
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 && price <= 10000000 ? price : null;
}

function parseFilters(text) {
  const json = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const filters = JSON.parse(json);
  return {
    location: cleanText(filters.location),
    country: cleanText(filters.country),
    category: CATEGORIES.includes(filters.category) ? filters.category : null,
    minPrice: cleanPrice(filters.minPrice),
    maxPrice: cleanPrice(filters.maxPrice),
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildQuery({ location, country, category, minPrice, maxPrice }) {
  const query = {};
  if (location) query.location = { $regex: escapeRegex(location), $options: "i" };
  if (country) query.country = { $regex: escapeRegex(country), $options: "i" };
  if (category) query.category = category;
  if (minPrice !== null || maxPrice !== null) {
    query.price = {};
    if (minPrice !== null) query.price.$gte = minPrice;
    if (maxPrice !== null) query.price.$lte = maxPrice;
  }
  return query;
}

module.exports.generateSearchFilters = async (req, res, next) => {
  try {
    const query = cleanText(req.body.query);
    if (!query) throw new ExpressError(400, "Please enter a search query.");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract property-search filters from this user request: "${query}".

Return valid JSON only, with exactly these keys:
{"location": null, "country": null, "category": null, "minPrice": null, "maxPrice": null}

Rules:
- Use null for information that was not requested.
- category must be one of: ${CATEGORIES.join(", ")}.
- Prices must be numeric Indian rupees, without currency symbols.
- Do not add markdown, explanations, or extra keys.`,
    });

    const filters = parseFilters(response.text || "");
    if (filters.minPrice !== null && filters.maxPrice !== null && filters.minPrice > filters.maxPrice) {
      [filters.minPrice, filters.maxPrice] = [filters.maxPrice, filters.minPrice];
    }
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null) params.set(key, value);
    });
    res.json({ success: true, redirectUrl: `/listings/nlp-search?${params.toString()}` });
  } catch (error) {
    next(error);
  }
};

module.exports.showSearchResults = async (req, res, next) => {
  try {
    const filters = {
      location: cleanText(req.query.location),
      country: cleanText(req.query.country),
      category: CATEGORIES.includes(req.query.category) ? req.query.category : null,
      minPrice: cleanPrice(req.query.minPrice),
      maxPrice: cleanPrice(req.query.maxPrice),
    };
    const allListing = await Listing.find(buildQuery(filters));
    res.render("listings/index", { allListing, searchFilters: filters });
  } catch (error) {
    next(error);
  }
};

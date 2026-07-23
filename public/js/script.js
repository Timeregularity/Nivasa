const descriptionButton = document.getElementById("generateDescription");

if (descriptionButton) {
  descriptionButton.addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const location = document.getElementById("location").value;
    const country = document.getElementById("country").value;
    const category = document.getElementById("category").value;
    const price = document.getElementById("price").value;

    if (!title || !location || !country || !price) {
      alert("Please fill Title, Location, Country and Price first.");
      return;
    }

    document.getElementById("loading").style.display = "block";
    try {
      const response = await fetch("/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, location, country, category, price }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "AI generation failed");
      document.getElementById("description").value = data.description;
    } catch (error) {
      alert("Failed to generate description.");
    } finally {
      document.getElementById("loading").style.display = "none";
    }
  });
}

const aiSearchForm = document.getElementById("aiSearchForm");
const aiQueryInput = document.getElementById("aiQueryInput");

if (aiSearchForm && aiQueryInput) {
  aiSearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = aiQueryInput.value.trim();
    if (!query) return;

    const submitButton = aiSearchForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Searching...";

    try {
      const response = await fetch("/ai/nlp-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Search failed");
      window.location.assign(data.redirectUrl);
    } catch (error) {
      alert("AI search could not be completed. Please try again.");
      submitButton.disabled = false;
      submitButton.textContent = "Search";
    }
  });
}

async function requestAI(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message || "AI request failed");
  return data;
}

const aiTools = document.querySelector(".ai-tools[data-listing-id]");
const summarizeReviewsButton = document.getElementById("summarizeReviews");
const reviewSummaryOutput = document.getElementById("aiReviewSummary");

if (aiTools && summarizeReviewsButton && reviewSummaryOutput) {
  summarizeReviewsButton.addEventListener("click", async () => {
    summarizeReviewsButton.disabled = true;
    reviewSummaryOutput.textContent = "Reading guest feedback...";
    try {
      const data = await requestAI(`/ai/listings/${aiTools.dataset.listingId}/review-summary`, { method: "POST" });
      reviewSummaryOutput.textContent = data.summary;
    } catch (error) {
      reviewSummaryOutput.textContent = "Review summary is not available right now.";
    } finally {
      summarizeReviewsButton.disabled = false;
    }
  });
}

const similarListingsButton = document.getElementById("findSimilarListings");
const similarListingsOutput = document.getElementById("similarListings");

if (aiTools && similarListingsButton && similarListingsOutput) {
  similarListingsButton.addEventListener("click", async () => {
    similarListingsButton.disabled = true;
    similarListingsOutput.textContent = "Finding similar stays...";
    try {
      const data = await requestAI(`/ai/listings/${aiTools.dataset.listingId}/similar`);
      similarListingsOutput.replaceChildren();
      if (!data.similarListings.length) {
        similarListingsOutput.textContent = "No similar stays are available yet.";
        return;
      }
      data.similarListings.forEach((listing) => {
        const link = document.createElement("a");
        link.href = `/listings/${listing.id}`;
        link.className = "ai-similar-card";
        link.textContent = `${listing.title} · ${listing.location} · ₹${listing.price}/night`;
        similarListingsOutput.appendChild(link);
      });
    } catch (error) {
      similarListingsOutput.textContent = "Similar stays are not available right now.";
    } finally {
      similarListingsButton.disabled = false;
    }
  });
}

const tripPlannerForm = document.getElementById("tripPlannerForm");
const tripPlanOutput = document.getElementById("tripPlanOutput");

if (tripPlannerForm && tripPlanOutput) {
  tripPlannerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = tripPlannerForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    tripPlanOutput.textContent = "Building your trip plan...";
    try {
      const formData = new FormData(tripPlannerForm);
      const data = await requestAI("/ai/trip-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      tripPlanOutput.replaceChildren();
      const plan = document.createElement("p");
      plan.textContent = data.plan;
      tripPlanOutput.appendChild(plan);
      if (data.stays.length) {
        const stays = document.createElement("p");
        stays.textContent = `Matching stays: ${data.stays.map((stay) => `${stay.title} (₹${stay.price}/night)`).join(", ")}`;
        tripPlanOutput.appendChild(stays);
      }
    } catch (error) {
      tripPlanOutput.textContent = "Your trip plan could not be created. Please try again.";
    } finally {
      submitButton.disabled = false;
    }
  });
}

// Bootstrap validation for forms that opt in with the .needs-validation class.
(() => {
  "use strict";
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    }, false);
  });
})();

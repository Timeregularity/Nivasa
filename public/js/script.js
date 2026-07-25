const CITY_FALLBACK = [
  { city: "Mumbai", region: "Maharashtra", country: "India" }, { city: "New Delhi", region: "Delhi", country: "India" }, { city: "Bengaluru", region: "Karnataka", country: "India" }, { city: "Hyderabad", region: "Telangana", country: "India" }, { city: "Chennai", region: "Tamil Nadu", country: "India" }, { city: "Kolkata", region: "West Bengal", country: "India" }, { city: "Pune", region: "Maharashtra", country: "India" }, { city: "Jaipur", region: "Rajasthan", country: "India" }, { city: "Goa", region: "Goa", country: "India" }, { city: "London", region: "England", country: "United Kingdom" }, { city: "Paris", region: "Île-de-France", country: "France" }, { city: "Tokyo", region: "Tokyo", country: "Japan" }, { city: "Dubai", region: "Dubai", country: "United Arab Emirates" }, { city: "Singapore", region: "Singapore", country: "Singapore" }, { city: "New York", region: "New York", country: "United States" }
];

function getSavedTheme() { return localStorage.getItem("staynest-theme") || "dark"; }
function updateThemeToggle(theme) {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  const dark = theme === "dark";
  toggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  toggle.setAttribute("title", dark ? "Switch to light mode" : "Switch to dark mode");
  toggle.innerHTML = `<i class="fa-solid fa-${dark ? "sun" : "moon"}" aria-hidden="true"></i>`;
}
function applyTheme(theme) { document.documentElement.setAttribute("data-theme", theme); localStorage.setItem("staynest-theme", theme); updateThemeToggle(theme); }
function toggleTheme() { applyTheme((document.documentElement.getAttribute("data-theme") || "dark") === "dark" ? "light" : "dark"); }
function debounce(callback, wait = 240) { let timer; return (...args) => { clearTimeout(timer); timer = window.setTimeout(() => callback(...args), wait); }; }
function filterLocalCities(query) { const value = query.toLocaleLowerCase(); return CITY_FALLBACK.filter((city) => [city.city, city.region, city.country].some((part) => part.toLocaleLowerCase().includes(value))).slice(0, 6); }
async function getCitySuggestions(query) {
  if (query.trim().length < 2) return [];
  try { const response = await fetch(`/api/locations/suggestions?query=${encodeURIComponent(query)}`); if (!response.ok) throw new Error("Lookup failed"); const cities = await response.json(); return cities.length ? cities : filterLocalCities(query); }
  catch { return filterLocalCities(query); }
}
function appendHighlightedText(element, text, query) {
  const start = text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
  if (start < 0) { element.textContent = text; return; }
  element.append(document.createTextNode(text.slice(0, start)));
  const mark = document.createElement("mark"); mark.textContent = text.slice(start, start + query.length);
  element.append(mark, document.createTextNode(text.slice(start + query.length)));
}
function setupCityAutocomplete(container) {
  const input = container.querySelector("input"), list = container.querySelector("[role=listbox]"), status = container.querySelector(".search-status"), loader = container.querySelector(".search-loader");
  let results = [], activeIndex = -1, requestId = 0;
  const close = () => { list.hidden = true; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); activeIndex = -1; };
  const select = (city) => { input.value = city.city; close(); input.focus(); };
  const render = (cities, query) => {
    list.replaceChildren(); results = cities; activeIndex = -1;
    if (!cities.length) { const item = document.createElement("li"); item.className = "city-empty"; item.textContent = "No matching cities found"; list.append(item); status.textContent = "No city suggestions found"; }
    else cities.forEach((city, index) => { const item = document.createElement("li"), button = document.createElement("button"), icon = document.createElement("i"), copy = document.createElement("span"), title = document.createElement("b"), details = document.createElement("small"); item.id = `city-option-${index}`; item.setAttribute("role", "option"); button.type = "button"; button.className = "city-suggestion"; icon.className = "fa-solid fa-location-dot"; appendHighlightedText(title, city.city, query); details.textContent = [city.region, city.country].filter(Boolean).join(", "); copy.append(title, details); button.append(icon, copy); button.addEventListener("click", () => select(city)); item.append(button); list.append(item); });
    list.hidden = false; input.setAttribute("aria-expanded", "true"); if (cities.length) status.textContent = `${cities.length} city suggestions available`;
  };
  const search = debounce(async () => { const query = input.value.trim(), currentRequest = ++requestId; if (query.length < 2) { close(); return; } loader.classList.remove("d-none"); status.textContent = "Loading city suggestions"; const cities = await getCitySuggestions(query); if (currentRequest === requestId) render(cities, query); loader.classList.add("d-none"); });
  input.addEventListener("input", search);
  input.addEventListener("keydown", (event) => { if (event.key === "Escape") { close(); return; } if (!results.length || list.hidden) return; if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); activeIndex = event.key === "ArrowDown" ? (activeIndex + 1) % results.length : (activeIndex - 1 + results.length) % results.length; [...list.querySelectorAll("[role=option]")].forEach((item, index) => item.classList.toggle("is-active", index === activeIndex)); input.setAttribute("aria-activedescendant", `city-option-${activeIndex}`); } else if (event.key === "Enter" && activeIndex >= 0) { event.preventDefault(); select(results[activeIndex]); } });
  document.addEventListener("click", (event) => { if (!container.contains(event.target)) close(); });
}

function setupBookingPanel(panel) {
  const checkIn = panel.querySelector("[name='booking[checkIn]']"), checkOut = panel.querySelector("[name='booking[checkOut]']"), total = panel.querySelector("#bookingTotal"), availability = panel.querySelector("#bookingAvailability"), submit = panel.querySelector("button[type='submit']"), nightlyPrice = Number(panel.dataset.nightlyPrice), today = new Date().toISOString().slice(0, 10);
  checkIn.min = today; checkOut.min = today;
  const checkAvailability = debounce(async () => {
    submit.disabled = true;
    if (!checkIn.value || !checkOut.value) { availability.textContent = "Select dates to check availability."; total.textContent = "₹0"; return; }
    const start = new Date(`${checkIn.value}T00:00:00`), end = new Date(`${checkOut.value}T00:00:00`), nights = Math.round((end - start) / 86400000);
    if (nights < 1) { availability.textContent = "Check-out must be after check-in."; total.textContent = "₹0"; return; }
    availability.textContent = "Checking availability…";
    try { const response = await fetch(`/bookings/listings/${panel.dataset.listingId}/availability?checkIn=${encodeURIComponent(checkIn.value)}&checkOut=${encodeURIComponent(checkOut.value)}`); const data = await response.json(); if (!response.ok || !data.available) throw new Error(data.message || "Dates unavailable"); total.textContent = `₹${(nightlyPrice * nights).toLocaleString("en-IN")}`; availability.textContent = `${nights} night${nights === 1 ? "" : "s"} available.`; submit.disabled = false; }
    catch (error) { total.textContent = "₹0"; availability.textContent = error.message || "Those dates are unavailable."; }
  }, 300);
  checkIn.addEventListener("change", () => { checkOut.min = checkIn.value || today; checkAvailability(); });
  checkOut.addEventListener("change", checkAvailability);
}

document.addEventListener("DOMContentLoaded", () => { applyTheme(getSavedTheme()); document.getElementById("themeToggle")?.addEventListener("click", toggleTheme); document.querySelectorAll("[data-city-autocomplete]").forEach(setupCityAutocomplete); document.querySelectorAll("[data-booking-panel]").forEach(setupBookingPanel); });

const descriptionButton = document.getElementById("generateDescription");
if (descriptionButton) descriptionButton.addEventListener("click", async () => {
  const title = document.getElementById("title").value, location = document.getElementById("location").value, country = document.getElementById("country").value, category = document.getElementById("category").value, price = document.getElementById("price").value;
  if (!title || !location || !country || !price) { alert("Please fill Title, Location, Country and Price first."); return; }
  document.getElementById("loading").style.display = "block";
  try { const response = await fetch("/ai/generate-description", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, location, country, category, price }) }); const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.message || "AI generation failed"); document.getElementById("description").value = data.description; }
  catch { alert("Failed to generate description."); } finally { document.getElementById("loading").style.display = "none"; }
});

document.querySelectorAll("[data-ai-search]").forEach((form) => form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = form.querySelector("input[name='query']"), query = input.value.trim();
  if (!query) return;
  const button = form.querySelector("button[type='submit']"), original = button.innerHTML, status = form.querySelector(".ai-search-status");
  button.disabled = true; button.classList.add("is-loading");
  if (status) { status.classList.remove("visually-hidden"); status.textContent = "AI search is finding stays"; }
  try { const response = await fetch("/ai/nlp-search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) }); const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.message || "Search failed"); window.location.assign(data.redirectUrl); }
  catch { if (status) status.textContent = "AI search could not be completed. Please try again."; else alert("AI search could not be completed. Please try again."); button.disabled = false; button.classList.remove("is-loading"); button.innerHTML = original; }
}));

async function requestAI(url, options = {}) { const response = await fetch(url, options); const data = await response.json().catch(() => ({ success: false, message: "The server returned an unexpected response." })); if (!response.ok || !data.success) throw new Error(data.message || "AI request failed"); return data; }
const aiTools = document.querySelector(".ai-tools[data-listing-id]"), summarizeReviewsButton = document.getElementById("summarizeReviews"), reviewSummaryOutput = document.getElementById("aiReviewSummary");
if (aiTools && summarizeReviewsButton && reviewSummaryOutput) summarizeReviewsButton.addEventListener("click", async () => { summarizeReviewsButton.disabled = true; reviewSummaryOutput.textContent = "Reading guest feedback..."; try { const data = await requestAI(`/ai/listings/${aiTools.dataset.listingId}/review-summary`, { method: "POST" }); reviewSummaryOutput.textContent = data.summary; } catch { reviewSummaryOutput.textContent = "Review summary is not available right now."; } finally { summarizeReviewsButton.disabled = false; } });
const similarListingsButton = document.getElementById("findSimilarListings"), similarListingsOutput = document.getElementById("similarListings");
if (aiTools && similarListingsButton && similarListingsOutput) similarListingsButton.addEventListener("click", async () => { similarListingsButton.disabled = true; similarListingsOutput.textContent = "Finding similar stays..."; try { const data = await requestAI(`/ai/listings/${aiTools.dataset.listingId}/similar`); similarListingsOutput.replaceChildren(); if (!data.similarListings.length) { similarListingsOutput.textContent = "No similar stays are available yet."; return; } data.similarListings.forEach((listing) => { const link = document.createElement("a"); link.href = `/listings/${listing.id}`; link.className = "ai-similar-card"; link.textContent = `${listing.title} · ${listing.location} · ₹${listing.price}/night`; similarListingsOutput.appendChild(link); }); } catch { similarListingsOutput.textContent = "Similar stays are not available right now."; } finally { similarListingsButton.disabled = false; } });
const tripPlannerForm = document.getElementById("tripPlannerForm"), tripPlanOutput = document.getElementById("tripPlanOutput");
if (tripPlannerForm && tripPlanOutput) tripPlannerForm.addEventListener("submit", async (event) => { event.preventDefault(); const button = tripPlannerForm.querySelector("button[type='submit']"); button.disabled = true; tripPlanOutput.textContent = "Building your trip plan..."; try { const formData = new FormData(tripPlannerForm); const data = await requestAI("/ai/trip-plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData)) }); tripPlanOutput.replaceChildren(); const plan = document.createElement("p"); plan.textContent = data.plan; tripPlanOutput.appendChild(plan); if (data.destinationMessage) { const correction = document.createElement("p"); correction.textContent = data.destinationMessage; tripPlanOutput.appendChild(correction); } if (data.stays.length) { const stays = document.createElement("p"); stays.textContent = `Matching stays: ${data.stays.map((stay) => `${stay.title} (₹${stay.price}/night)`).join(", ")}`; tripPlanOutput.appendChild(stays); } } catch (error) { tripPlanOutput.textContent = error.message || "Your trip plan could not be created. Please try again."; } finally { button.disabled = false; } });

const assistantPlanForm = document.getElementById("assistantPlanForm");
if (assistantPlanForm) {
  const result = document.getElementById("assistantResult"), typing = document.getElementById("assistantTyping");
  const runAssistantPlan = async () => {
    if (!assistantPlanForm.checkValidity()) { assistantPlanForm.reportValidity(); return; }
    const button = assistantPlanForm.querySelector("button"), formData = new FormData(assistantPlanForm);
    button.disabled = true; typing.classList.remove("d-none"); result.classList.add("d-none");
    try { const data = await requestAI("/ai/trip-plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData)) }); result.replaceChildren(); const heading = document.createElement("b"); heading.textContent = "Your AI travel starting point"; const plan = document.createElement("p"); plan.textContent = data.plan; result.append(heading, plan); if (data.destinationMessage) { const note = document.createElement("p"); note.className = "assistant-result-note"; note.textContent = data.destinationMessage; result.append(note); } if (data.stays?.length) { const stays = document.createElement("div"); stays.className = "assistant-stays"; data.stays.forEach((stay) => { const link = document.createElement("a"); link.href = `/listings/${stay.id}`; link.textContent = `${stay.title} · ${stay.location} · ₹${stay.price}/night`; stays.append(link); }); result.append(stays); } result.classList.remove("d-none"); }
    catch (error) { result.textContent = error.message || "The assistant is unavailable right now. Please retry."; result.classList.remove("d-none"); }
    finally { button.disabled = false; typing.classList.add("d-none"); }
  };
  assistantPlanForm.addEventListener("submit", (event) => { event.preventDefault(); runAssistantPlan(); });
  document.querySelectorAll(".assistant-prompt").forEach((prompt) => prompt.addEventListener("click", () => { ["destination", "days", "travelers", "budget"].forEach((field) => { assistantPlanForm.elements[field].value = prompt.dataset[field]; }); runAssistantPlan(); }));
}

(() => { const forms = document.querySelectorAll(".needs-validation"); Array.from(forms).forEach((form) => form.addEventListener("submit", (event) => { if (!form.checkValidity()) { event.preventDefault(); event.stopPropagation(); } form.classList.add("was-validated"); }, false)); })();

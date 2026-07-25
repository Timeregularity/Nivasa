const Booking = require("../DBModels/booking");
const BlockedDate = require("../DBModels/blockedDate");
const Listing = require("../DBModels/listing");
const ExpressError = require("../utils/expressErrors");

const DAY = 24 * 60 * 60 * 1000;
const startOfDay = (value) => { const date = new Date(value); date.setHours(0, 0, 0, 0); return date; };
const overlaps = (listingId, start, end) => ({ listing: listingId, startDate: { $lt: end }, endDate: { $gt: start } });
const bookingOverlap = (listingId, start, end) => ({ listing: listingId, status: { $in: ["pending", "confirmed"] }, checkIn: { $lt: end }, checkOut: { $gt: start } });

async function assertAvailable(listingId, checkIn, checkOut, ignoreBookingId = null) {
  const bookingQuery = bookingOverlap(listingId, checkIn, checkOut);
  if (ignoreBookingId) bookingQuery._id = { $ne: ignoreBookingId };
  const [booking, blocked] = await Promise.all([
    Booking.exists(bookingQuery),
    BlockedDate.exists(overlaps(listingId, checkIn, checkOut))
  ]);
  if (booking || blocked) throw new ExpressError(409, "These dates are no longer available. Please choose another stay period.");
}

function validateDates(checkInValue, checkOutValue) {
  const checkIn = startOfDay(checkInValue), checkOut = startOfDay(checkOutValue), today = startOfDay(new Date());
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkIn < today || checkOut <= checkIn) throw new ExpressError(400, "Choose a valid future check-in and check-out date.");
  return { checkIn, checkOut, nights: Math.round((checkOut - checkIn) / DAY) };
}

module.exports.create = async (req, res) => {
  if (req.user.role === "owner") throw new ExpressError(403, "Owner accounts manage bookings; use a customer account to place a stay request.");
  const listing = await Listing.findById(req.params.listingId);
  if (!listing) throw new ExpressError(404, "Listing not found.");
  if (listing.owner.equals(req.user._id)) throw new ExpressError(403, "You cannot book your own listing.");
  const { checkIn, checkOut, nights } = validateDates(req.body.booking.checkIn, req.body.booking.checkOut);
  await assertAvailable(listing._id, checkIn, checkOut);
  const booking = await Booking.create({
    listing: listing._id, customer: req.user._id, owner: listing.owner,
    checkIn, checkOut, guests: req.body.booking.guests,
    totalPrice: Number(listing.price) * nights, notes: req.body.booking.notes || ""
  });
  req.flash("success", `Booking request ${booking._id.toString().slice(-6).toUpperCase()} sent to the owner.`);
  res.redirect("/bookings/dashboard");
};

module.exports.availability = async (req, res) => {
  try {
    const { checkIn, checkOut } = validateDates(req.query.checkIn, req.query.checkOut);
    await assertAvailable(req.params.listingId, checkIn, checkOut);
    res.json({ available: true, nights: Math.round((checkOut - checkIn) / DAY) });
  } catch (error) {
    res.status(error.statusCode || 400).json({ available: false, message: error.message });
  }
};

module.exports.cancel = async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.bookingId, customer: req.user._id });
  if (!booking) throw new ExpressError(404, "Booking not found.");
  if (!["pending", "confirmed"].includes(booking.status)) throw new ExpressError(400, "This booking cannot be cancelled.");
  booking.status = "cancelled"; booking.cancelledAt = new Date(); await booking.save();
  req.flash("success", "Your booking has been cancelled."); res.redirect("/bookings/dashboard");
};

module.exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!["confirmed", "cancelled", "completed"].includes(status)) throw new ExpressError(400, "Invalid booking status.");
  const booking = await Booking.findOne({ _id: req.params.bookingId, owner: req.user._id });
  if (!booking) throw new ExpressError(404, "Booking not found.");
  if (status === "confirmed") await assertAvailable(booking.listing, booking.checkIn, booking.checkOut, booking._id);
  booking.status = status; if (status === "cancelled") booking.cancelledAt = new Date(); await booking.save();
  req.flash("success", `Booking marked as ${status}.`); res.redirect("/bookings/dashboard");
};

module.exports.blockDates = async (req, res) => {
  if (req.user.role !== "owner") throw new ExpressError(403, "Only owner accounts can block availability.");
  const listing = await Listing.findOne({ _id: req.params.listingId, owner: req.user._id });
  if (!listing) throw new ExpressError(404, "Listing not found or you do not own it.");
  const { checkIn: startDate, checkOut: endDate } = validateDates(req.body.blockedDate.startDate, req.body.blockedDate.endDate);
  const conflict = await Booking.exists(bookingOverlap(listing._id, startDate, endDate));
  if (conflict) throw new ExpressError(409, "A pending or confirmed booking already covers part of this period.");
  await BlockedDate.create({ listing: listing._id, owner: req.user._id, startDate, endDate, note: req.body.blockedDate.note || "" });
  req.flash("success", "Dates have been blocked."); res.redirect("/bookings/dashboard");
};

module.exports.dashboard = async (req, res) => {
  const isOwner = req.user.role === "owner";
  if (!isOwner) {
    const bookings = await Booking.find({ customer: req.user._id }).populate("listing").sort({ checkIn: 1 });
    return res.render("bookings/dashboard", { isOwner: false, bookings, metrics: null, blockedDates: [], listings: [] });
  }
  const [bookings, listings, blockedDates] = await Promise.all([
    Booking.find({ owner: req.user._id }).populate("listing customer").sort({ checkIn: 1 }),
    Listing.find({ owner: req.user._id }),
    BlockedDate.find({ owner: req.user._id }).populate("listing").sort({ startDate: 1 })
  ]);
  const confirmed = bookings.filter((booking) => ["confirmed", "completed"].includes(booking.status));
  const revenue = confirmed.reduce((total, booking) => total + booking.totalPrice, 0);
  const stayDays = confirmed.reduce((total, booking) => total + Math.round((booking.checkOut - booking.checkIn) / DAY), 0);
  const nextThirtyDays = 30 * DAY;
  const occupancy = listings.length ? Math.min(100, Math.round((stayDays / (listings.length * 30)) * 100)) : 0;
  res.render("bookings/dashboard", { isOwner: true, bookings, blockedDates, listings, metrics: { listingCount: listings.length, pendingCount: bookings.filter((booking) => booking.status === "pending").length, confirmedCount: bookings.filter((booking) => booking.status === "confirmed").length, revenue, occupancy, nextThirtyDays } });
};

module.exports.assertAvailable = assertAvailable;

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const bookingController = require("../controllers/booking");
const { isLoggedIn, validateBooking, validateBlockedDate } = require("../middlewares");

router.get("/", isLoggedIn, wrapAsync(bookingController.dashboard));
router.get("/dashboard", isLoggedIn, wrapAsync(bookingController.dashboard));
router.get("/listings/:listingId/availability", wrapAsync(bookingController.availability));
router.post("/listings/:listingId", isLoggedIn, validateBooking, wrapAsync(bookingController.create));
router.post("/listings/:listingId/blocked-dates", isLoggedIn, validateBlockedDate, wrapAsync(bookingController.blockDates));
router.post("/:bookingId/cancel", isLoggedIn, wrapAsync(bookingController.cancel));
router.post("/:bookingId/status", isLoggedIn, wrapAsync(bookingController.updateStatus));
module.exports = router;

const crypto = require("crypto");
const AvailabilityLock = require("../DBModels/availabilityLock");
const ExpressError = require("./expressErrors");

const DAY = 24 * 60 * 60 * 1000;
const PENDING_LEASE_MS = 30 * 60 * 1000;

function nightsBetween(checkIn, checkOut) {
  const dates = [];
  for (let time = checkIn.getTime(); time < checkOut.getTime(); time += DAY) dates.push(new Date(time));
  return dates;
}

async function acquireLease({ listing, checkIn, checkOut, kind = "booking", permanent = false }) {
  const dates = nightsBetween(checkIn, checkOut);
  if (!dates.length) throw new ExpressError(400, "A stay must contain at least one night.");
  const now = new Date();
  await AvailabilityLock.deleteMany({ listing, date: { $in: dates }, expiresAt: { $lte: now } });
  const leaseId = crypto.randomUUID();
  const expiresAt = permanent ? null : new Date(now.getTime() + PENDING_LEASE_MS);
  try {
    await AvailabilityLock.insertMany(dates.map((date) => ({ listing, date, leaseId, kind, expiresAt })), { ordered: true });
    return { leaseId, expiresAt, nights: dates.length };
  } catch (error) {
    await AvailabilityLock.deleteMany({ leaseId });
    if (error?.code === 11000) throw new ExpressError(409, "Those dates were just reserved by another guest. Please choose another stay period.");
    throw error;
  }
}

async function releaseLease(leaseId) {
  if (leaseId) await AvailabilityLock.deleteMany({ leaseId });
}

async function makePermanent(leaseId, expectedNights) {
  const result = await AvailabilityLock.updateMany(
    { leaseId, $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] },
    { $set: { expiresAt: null } }
  );
  return result.matchedCount === expectedNights;
}

module.exports = { DAY, PENDING_LEASE_MS, nightsBetween, acquireLease, releaseLease, makePermanent };

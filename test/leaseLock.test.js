const test = require("node:test");
const assert = require("node:assert/strict");
const { nightsBetween } = require("../utils/leaseLock");

test("creates one lock key for every occupied night", () => {
  const dates = nightsBetween(new Date("2026-10-10T00:00:00.000Z"), new Date("2026-10-13T00:00:00.000Z"));
  assert.deepEqual(dates.map((date) => date.toISOString().slice(0, 10)), ["2026-10-10", "2026-10-11", "2026-10-12"]);
});

test("adjacent stays do not share a lock key", () => {
  const first = nightsBetween(new Date("2026-10-10T00:00:00.000Z"), new Date("2026-10-12T00:00:00.000Z"));
  const second = nightsBetween(new Date("2026-10-12T00:00:00.000Z"), new Date("2026-10-14T00:00:00.000Z"));
  assert.equal(first.some((date) => second.some((other) => date.getTime() === other.getTime())), false);
});

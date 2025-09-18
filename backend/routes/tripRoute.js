// tripRoute.js
import express from "express";
import Trip from "../models/Trip.js";
import authMiddleware from "../middleware/auth.js"; // ✅ checks JWT and sets req.user

const router = express.Router();

/* Save or update trip */
router.post("/trip", authMiddleware, async (req, res) => {
  try {
    const { tripId, prefs, budgetData, transportData, accommodation, activities, itinerary, mapImage } = req.body;

    let trip;
    if (tripId) {
      trip = await Trip.findOneAndUpdate(
        { _id: tripId, userId: req.user._id }, // ✅ only update own trip
        { prefs, budgetData, transportData, accommodation, activities, itinerary, mapImage },
        { new: true }
      );
    } else {
      trip = new Trip({
        userId: req.user._id,
        prefs,
        budgetData,
        transportData,
        accommodation,
        activities,
        itinerary,
        mapImage,
      });
      await trip.save();
    }

    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: "Failed to save trip" });
  }
});

/* Get trip by ID */
router.get("/trip/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: "Error fetching trip" });
  }
});

/* Get latest trip for logged-in user */
router.get("/trip/latest", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    if (!trip) return res.status(404).json({ error: "No trips found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: "Error fetching latest trip" });
  }
});

export default router;

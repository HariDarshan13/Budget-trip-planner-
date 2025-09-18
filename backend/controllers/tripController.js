import Trip from "../models/Trip.js";

export const createTrip = async (req, res) => {
  try {
    const trip = new Trip(req.body);
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    res.json(trip);
  } catch (err) {
    res.status(404).json({ error: "Trip not found" });
  }
};

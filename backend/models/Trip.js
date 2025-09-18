import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  prefs: {
    source: String,
    destination: [String],
    startDate: String,
    endDate: String,
    budget: Number,
    tripType: String,
  },
  budgetData: Object,
  transportData: Object,
  selectedHotel: Object,
  itinerary: Object, // store day-wise activities
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Trip", TripSchema);

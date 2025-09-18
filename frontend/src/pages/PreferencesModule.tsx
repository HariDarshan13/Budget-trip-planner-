import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/background2.jpg";


// ✅ API helper to save trip to backend
const saveTripToDB = async (data: any) => {
  try {
    const res = await fetch("http://localhost:5000/api/trip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error("Error saving trip:", err);
    return null;
  }
};
type PreferencesState = {
  startDate: string;
  endDate: string;
  budget: number;
  source: string;
  destination: string;
  interests: string[];
  accommodation: string;
  transport: string;
  people: number;
};

export default function Preferences(): JSX.Element {
  const [preferences, setPreferences] = useState<PreferencesState>({
    startDate: "",
    endDate: "",
    budget: 15000,
    source: "",
    destination: "",
    interests: [],
    accommodation: "",
    transport: "",
    people: 0,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const interestOptions = [
    { label: "Adventure", emoji: "🏔️" },
    { label: "Relaxation", emoji: "🏖️" },
    { label: "Culture", emoji: "🎭" },
    { label: "Food", emoji: "🍲" },
    { label: "Wildlife", emoji: "🐘" },
    { label: "Shopping", emoji: "🛍️" },
    { label: "Photography", emoji: "📸" },
  ];

  const accommodations = ["Hotel", "Hostel", "Airbnb"];
  const transports = ["Flight", "Bus", "Train", "Car"];

  const districts = [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Erode",
    "Tirunelveli",
    "Vellore",
    "Thoothukudi",
    "Thanjavur",
  ];

  const touristPlaces = [
    "Marina Beach",
    "Meenakshi Amman Temple",
    "Ooty",
    "Kodaikanal",
    "Mahabalipuram",
    "Rameswaram",
    "Kanyakumari",
    "Yercaud",
    "Mudumalai",
    "Chidambaram",
  ];

  const handleChange = (field: keyof PreferencesState, value: any) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (label: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(label)
        ? prev.interests.filter((i) => i !== label)
        : [...prev.interests, label],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!preferences.startDate) newErrors.push("Start Date is required.");
    if (!preferences.endDate) newErrors.push("End Date is required.");
    if (!preferences.source) newErrors.push("Source is required.");
    if (!preferences.destination) newErrors.push("Destination is required.");
    if (preferences.interests.length === 0)
      newErrors.push("At least one interest must be selected.");
    if (!preferences.accommodation)
      newErrors.push("Accommodation preference is required.");
    if (!preferences.transport)
      newErrors.push("Transport mode is required.");
    if (preferences.people <= 0)
      newErrors.push("Please select number of people.");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // ✅ Save to localStorage
    localStorage.setItem("prefs", JSON.stringify(preferences));

    // ✅ Save to backend (send plain object, not { prefs: ... })
    const savedTrip = await saveTripToDB(preferences);

    if (savedTrip && savedTrip._id) {
      console.log("Trip saved to DB:", savedTrip);
      localStorage.setItem("tripId", savedTrip._id);
    }

    // Navigate to Budget Page
    navigate("/budget", { state: preferences });
  };

  const renderButtonGroup = (options: string[], field: keyof PreferencesState) => {
    return (
      <div className="flex flex-wrap gap-3 mb-4">
        {options.map((option) => {
          const active = preferences[field] === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleChange(field, option)}
              className={`px-4 py-2 rounded-full border text-sm transition ${
                active
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-200 hover:shadow-sm"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

      <Card className="relative w-full max-w-3xl bg-white/85 shadow-2xl rounded-2xl border border-white/30">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
            Customize Your Preferences
          </h1>
          <p className="text-center text-sm text-slate-600 mb-6">
            Fill in your travel details to personalize your Tamil Nadu itinerary.
          </p>

          {/* Travel Dates */}
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={preferences.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={preferences.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Budget Slider */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Budget: ₹{preferences.budget.toLocaleString()}
            </label>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={preferences.budget}
              onChange={(e) => handleChange("budget", Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>₹0</span>
              <span>₹50k+</span>
            </div>
          </div>

          {/* Source & Destination */}
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Source 📍
              </label>
              <select
                value={preferences.source}
                onChange={(e) => handleChange("source", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Select district</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Destination 📍
              </label>
              <select
                value={preferences.destination}
                onChange={(e) => handleChange("destination", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Select destination</option>
                {touristPlaces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Number of People */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Number of People 👥
            </label>
            <select
              value={preferences.people}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleChange("people", Number(e.target.value))
              }
              className="w-full rounded-lg border px-3 py-2 bg-white shadow-sm text-slate-700 
               focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-400 
               transition"
            >
              <option value="">Select people</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Person" : "People"}
                </option>
              ))}
            </select>
          </div>

          {/* Interests */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Interests 🎯
            </label>
            <div className="flex flex-wrap gap-3">
              {interestOptions.map(({ label, emoji }) => {
                const checked = preferences.interests.includes(label);
                return (
                  <label
                    key={label}
                    className={`flex items-center px-4 py-2 rounded-full border cursor-pointer text-sm transition ${
                      checked
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-700 border-slate-200 hover:shadow-sm"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleInterest(label)}
                      className="mr-2"
                    />
                    {emoji} {label}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Accommodation */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Accommodation Preference
            </label>
            {renderButtonGroup(accommodations, "accommodation")}
          </div>

          {/* Transport Mode */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Transport Mode 🚗
            </label>
            {renderButtonGroup(transports, "transport")}
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-4 text-red-600 text-sm">
              <ul className="list-disc list-inside">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Save Button */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              Move to Budget Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

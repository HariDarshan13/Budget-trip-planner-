import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/background3.jpg";
import flightImg from "@/assets/flight.jpg";
import trainImg from "@/assets/train.jpg";
import busImg from "@/assets/bus.jpg";
import carImg from "@/assets/car.jpg";

type Preferences = {
  startDate: string;
  endDate: string;
  budget: number;
  source: string;
  destination: string;
  interests: string[];
  accommodation: string;
  transport: string;
  people?: string;
};

type TransportOption = {
  name: string;
  km: number;
  originalPrice: number;
  discount: number;
  image: string;
  time: string;
  stops: { place: string; arrival: string }[];
  startPoint: string;
  endPoint: string;
};

export default function TransportModule() {
  const location = useLocation();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [selectedType, setSelectedType] = useState<string>("Flight");
  const [options, setOptions] = useState<TransportOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<TransportOption | null>(null);
  const [modalOption, setModalOption] = useState<TransportOption | null>(null);

  // Load preferences
  useEffect(() => {
    if (location.state?.prefs) setPrefs(location.state.prefs);
    else {
      const stored = localStorage.getItem("prefs");
      if (stored) setPrefs(JSON.parse(stored));
    }
  }, [location.state]);

  // Generate dummy transport options
  useEffect(() => {
    if (!prefs) return;
    const budgetTransport = prefs.budget * 0.3;
    let dummy: TransportOption[] = [];

    switch (selectedType) {
      case "Flight":
        dummy = [
          { name: "IndiGo IG123", km: 500, originalPrice: 5000, discount: 10, image: flightImg, time: "1h 30m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Checkpoint A", arrival: "10:30 AM" }, { place: "Checkpoint B", arrival: "11:00 AM" }] },
          { name: "Air India AI456", km: 500, originalPrice: 5500, discount: 15, image: flightImg, time: "1h 20m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Checkpoint X", arrival: "10:20 AM" }, { place: "Checkpoint Y", arrival: "10:50 AM" }] },
          { name: "SpiceJet SG789", km: 500, originalPrice: 4800, discount: 5, image: flightImg, time: "1h 40m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Checkpoint C", arrival: "11:10 AM" }, { place: "Checkpoint D", arrival: "11:40 AM" }] },
          { name: "GoAir GO101", km: 500, originalPrice: 4700, discount: 12, image: flightImg, time: "1h 35m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Checkpoint E", arrival: "11:30 AM" }, { place: "Checkpoint F", arrival: "12:00 PM" }] },
          { name: "Vistara VT202", km: 500, originalPrice: 5200, discount: 8, image: flightImg, time: "1h 25m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Checkpoint G", arrival: "12:10 PM" }, { place: "Checkpoint H", arrival: "12:35 PM" }] },
          { name: "AirAsia AX303", km: 500, originalPrice: 4600, discount: 20, image: flightImg, time: "1h 50m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Checkpoint I", arrival: "12:50 PM" }, { place: "Checkpoint J", arrival: "01:20 PM" }] },
        ];
        break;
      case "Train":
        dummy = [
          { name: "Shatabdi Express", km: 500, originalPrice: 1500, discount: 5, image: trainImg, time: "5h", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Station 1", arrival: "08:30 AM" }, { place: "Station 2", arrival: "09:30 AM" }] },
          { name: "Express 123", km: 500, originalPrice: 1200, discount: 10, image: trainImg, time: "6h", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Station 3", arrival: "08:45 AM" }, { place: "Station 4", arrival: "09:45 AM" }] },
          { name: "Rajdhani Express", km: 500, originalPrice: 1800, discount: 8, image: trainImg, time: "4h 50m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Station 5", arrival: "09:00 AM" }, { place: "Station 6", arrival: "09:50 AM" }] },
          { name: "Intercity Express", km: 500, originalPrice: 1000, discount: 5, image: trainImg, time: "6h 10m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Station 7", arrival: "10:00 AM" }, { place: "Station 8", arrival: "11:10 AM" }] },
          { name: "Duronto Express", km: 500, originalPrice: 2000, discount: 12, image: trainImg, time: "4h 40m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Station 9", arrival: "07:30 AM" }, { place: "Station 10", arrival: "08:10 AM" }] },
        ];
        break;
      case "Bus":
        dummy = [
          { name: "Volvo AC", km: 500, originalPrice: 800, discount: 0, image: busImg, time: "7h", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Stop A", arrival: "07:30 AM" }, { place: "Stop B", arrival: "10:00 AM" }] },
          { name: "Standard Bus", km: 500, originalPrice: 500, discount: 5, image: busImg, time: "8h", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Stop C", arrival: "08:00 AM" }, { place: "Stop D", arrival: "11:00 AM" }] },
          { name: "Sleeper Bus", km: 500, originalPrice: 1000, discount: 10, image: busImg, time: "6h 30m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Stop E", arrival: "09:00 AM" }, { place: "Stop F", arrival: "12:00 PM" }] },
          { name: "Luxury Volvo", km: 500, originalPrice: 1200, discount: 15, image: busImg, time: "6h", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Stop G", arrival: "10:00 AM" }, { place: "Stop H", arrival: "12:30 PM" }] },
          { name: "AC Express", km: 500, originalPrice: 900, discount: 8, image: busImg, time: "7h 10m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Stop I", arrival: "07:30 AM" }, { place: "Stop J", arrival: "02:30 PM" }] },
        ];
        break;
      case "Car":
        dummy = [
          { name: "Sedan Rental", km: 500, originalPrice: 2000, discount: 10, image: carImg, time: "6h", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Checkpoint 1", arrival: "09:00 AM" }, { place: "Checkpoint 2", arrival: "11:00 AM" }] },
          { name: "SUV Rental", km: 500, originalPrice: 2500, discount: 5, image: carImg, time: "5h 45m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Checkpoint 3", arrival: "08:00 AM" }, { place: "Checkpoint 4", arrival: "12:00 PM" }] },
          { name: "Mini Car", km: 500, originalPrice: 1500, discount: 8, image: carImg, time: "6h 15m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Checkpoint 5", arrival: "09:30 AM" }, { place: "Checkpoint 6", arrival: "12:00 PM" }] },
          { name: "Luxury Sedan", km: 500, originalPrice: 3000, discount: 12, image: carImg, time: "5h 30m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Checkpoint 7", arrival: "07:30 AM" }, { place: "Checkpoint 8", arrival: "01:00 PM" }] },
          { name: "Hatchback Rental", km: 500, originalPrice: 1700, discount: 10, image: carImg, time: "6h 10m", startPoint: prefs.source, endPoint: prefs.destination, stops: [{ place: "Checkpoint 9", arrival: "08:30 AM" }, { place: "Checkpoint 10", arrival: "02:40 PM" }] },
        ];
        break;
    }

    const filtered = dummy.filter(
      (o) => o.originalPrice * (1 - o.discount / 100) <= budgetTransport
    );

    setOptions(filtered);
    setSelectedOption(null);
    setModalOption(null);
  }, [selectedType, prefs]);

  if (!prefs) return <p className="text-center mt-10 text-white">No preferences found. Please fill budget first.</p>;

  const handleMoveToAccommodation = () => {
    navigate("/accommodation", {
      state: { prefs, transport: selectedOption },
    });
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center p-6"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <Card className="relative w-full max-w-5xl bg-white/80 shadow-2xl rounded-2xl border border-white/30 z-10">
        <CardContent className="space-y-6 p-8">

          <h1 className="text-3xl font-bold text-black text-center mb-2">Transport Module</h1>
          <p className="text-center text-sm text-gray-600 mb-6">Select your transport option and view details before confirming.</p>

          {/* Preferences Card */}
          <Card className="bg-white/70 rounded-2xl border border-gray-200">
            <CardContent className="space-y-1 text-sm">
              <p>📅 <strong>{prefs.startDate}</strong> → <strong>{prefs.endDate}</strong></p>
              <p>📍 From <strong>{prefs.source}</strong> → <strong>{prefs.destination}</strong></p>
              <p>💰 Budget: ₹{prefs.budget.toLocaleString()}</p>
              {prefs.people && <p>👥 People: {prefs.people}</p>}
            </CardContent>
          </Card>

          {/* Transport Type Selection */}
          <Card className="bg-white/70 rounded-2xl border border-gray-200">
            <CardContent className="flex justify-center gap-4 p-4 flex-wrap">
              {[
                { type: "Flight", icon: "✈️" },
                { type: "Train", icon: "🚆" },
                { type: "Bus", icon: "🚌" },
                { type: "Car", icon: "🚗" },
              ].map(({ type, icon }) => (
                <Button
                  key={type}
                  className={`px-6 py-2 rounded-full text-sm flex items-center gap-2 justify-center transition-all duration-300 ${
                    selectedType === type ? "bg-blue-600 text-white" : "bg-white text-slate-700 border"
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  <span className="text-lg">{icon}</span>
                  {type}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Transport Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {options.map((opt, idx) => {
              const finalPrice = Math.round(opt.originalPrice * (1 - opt.discount / 100));
              const isSelected = selectedOption === opt;
              return (
                <Card key={idx} className={`p-4 border rounded-2xl shadow-md bg-white/90 transition-transform duration-300 hover:scale-105 ${isSelected ? "border-blue-600" : ""}`}>
                  <img src={opt.image} alt={opt.name} className="w-full h-36 object-cover rounded-lg mb-2" />
                  <p className="font-semibold">{opt.name}</p>
                  {isSelected && <p className="text-blue-600 font-semibold text-sm">Selected</p>}
                  <p className="text-sm text-gray-600">{opt.km} km | {opt.time}</p>
                  <p className="text-sm text-gray-600">Original: ₹{opt.originalPrice}</p>
                  <p className="text-sm text-green-600">Discount: {opt.discount}% → ₹{finalPrice}</p>
                  <Button size="sm" className="mt-2 w-full" onClick={() => setModalOption(opt)}>View Details</Button>
                </Card>
              );
            })}
          </div>

          {/* Move to Accommodation Button */}
          <div className="text-center mt-6">
            <Button
              className={`px-6 py-3 rounded-lg text-white ${selectedOption ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
              onClick={handleMoveToAccommodation}
              disabled={!selectedOption}
            >
              Move to Accommodation →
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Modal with Fade + Slide animation */}
      {modalOption && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-lg rounded-2xl shadow-2xl p-6 transform transition-all duration-500 scale-90 opacity-0 animate-fade-in-slide-up">
            <h2 className="text-2xl font-bold mb-4">{modalOption.name}</h2>
            <img src={modalOption.image} alt={modalOption.name} className="w-full h-40 object-cover rounded-lg mb-4" />
            <p><strong>From:</strong> {modalOption.startPoint}</p>
            <p><strong>To:</strong> {modalOption.endPoint}</p>
            <p><strong>Distance:</strong> {modalOption.km} km | <strong>Duration:</strong> {modalOption.time}</p>
            <p className="mt-2 font-semibold">Stops:</p>
            <ul className="list-disc list-inside text-sm mb-4">
              {modalOption.stops.map((stop, i) => (<li key={i}>{stop.place} - Arrival: {stop.arrival}</li>))}
            </ul>
            <div className="flex justify-center gap-4 mt-4">
              <Button className="bg-green-600 text-white px-6 py-2 rounded-lg" onClick={() => { setSelectedOption(modalOption); setModalOption(null); }}>
                Select
              </Button>
              <Button className="bg-red-600 text-white px-6 py-2 rounded-lg" onClick={() => setModalOption(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind animation */}
      <style>
        {`
          @keyframes fade-in-slide-up {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-slide-up {
            animation: fade-in-slide-up 0.3s ease-out forwards;
          }
        `}
      </style>

    </div>
  );
}

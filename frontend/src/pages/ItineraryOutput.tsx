import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

/* ---------- Sample dataset for activities ---------- */
const ACTIVITIES_BY_PLACE: Record<string, any[]> = {
  "Marina Beach": [
    {
      id: "mb-beach-walk",
      title: "Marina Beach Promenade Walk",
      desc: "Sunrise/sunset walk along the longest urban beach.",
      interest: "relaxation",
      price: 0,
      rating: 4.4,
      reviews: 1200,
      image:
        "https://th.bing.com/th/id/OIP.fdKxOxIdYzw_ZTNPVCP-wQHaEK?w=323&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
    {
      id: "mb-fish-market",
      title: "Local Fish Market & Street Food",
      desc: "Taste fresh seafood and local snacks near the shore.",
      interest: "food",
      price: 300,
      rating: 4.1,
      reviews: 460,
      image:
        "https://www.livechennai.com/businesslistings/News_photo/Fishmarket-81021.jpg",
    },
  ],
};

const FullItinerarySummary: React.FC = () => {
  const [allData, setAllData] = useState<Record<string, any>>({});
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const safeParse = (key: string) => {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    };

    const keys = ["prefs", "transportData", "selectedHotel", "activities"];
    const collected: Record<string, any> = {};

    keys.forEach((k) => {
      const val = safeParse(k);
      if (val) collected[k] = val;
    });

    // Remove unnecessary IDs and images
    if (collected.selectedHotel) {
      delete collected.selectedHotel._id;
      delete collected.selectedHotel.id;
      delete collected.selectedHotel.image;
      delete collected.selectedHotel.images;
    }

    if (collected.transportData && collected.transportData.image) {
      delete collected.transportData.image;
    }

    setAllData(collected);

    // Collect activities for destinations
    if (collected.prefs?.destination) {
      const dests = Array.isArray(collected.prefs.destination)
        ? collected.prefs.destination
        : [collected.prefs.destination];

      const collectedActivities = dests.flatMap(
        (d: string) => ACTIVITIES_BY_PLACE[d] || []
      );
      setActivities(collectedActivities);
    }
  }, []);

  const renderObject = (obj: any, excludeKeys: string[] = []) => (
    <ul className="list-disc list-inside space-y-1">
      {Object.entries(obj)
        .filter(([k]) => !excludeKeys.includes(k))
        .map(([k, v]) => (
          <li key={k}>
            <strong className="capitalize">{k}:</strong>{" "}
            {typeof v === "object" ? JSON.stringify(v) : String(v)}
          </li>
        ))}
    </ul>
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 30;
    let y = margin;
    const lineHeight = 18;

    // Draw border
    doc.setDrawColor(0);
    doc.setLineWidth(0.8);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

    // Add main title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Complete Travel Summary", pageWidth / 2, y, { align: "center" });
    y += 35;

    const addHeader = (title: string) => {
      if (y > pageHeight - margin - 40) {
        doc.addPage();
        y = margin + 20;
        doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
      }
      doc.setFillColor(60, 130, 180);
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.rect(margin + 1, y - 16, pageWidth - 2 * margin - 2, 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin + 10, y);
      y += 25;
      doc.setTextColor(0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
    };

    const addText = (text: string, indent = 0) => {
      if (y > pageHeight - margin - 20) {
        doc.addPage();
        y = margin + 20;
        doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
      }
      const splitText = doc.splitTextToSize(text, pageWidth - 2 * margin - 20 - indent);
      doc.text(splitText, margin + 10 + indent, y);
      y += splitText.length * lineHeight;
    };

    // Preferences
    if (allData.prefs) {
      addHeader("Preferences");
      Object.entries(allData.prefs).forEach(([k, v]) =>
        addText(`${k}: ${String(v)}`, 4)
      );
      y += 10;
    }

    // Transport
    if (allData.transportData) {
      addHeader("Transport");
      Object.entries(allData.transportData).forEach(([k, v]) =>
        addText(`${k}: ${String(v)}`, 4)
      );
      y += 10;
    }

    // Hotel
    if (allData.selectedHotel) {
      addHeader("Selected Hotel");
      Object.entries(allData.selectedHotel).forEach(([k, v]) =>
        addText(`${k}: ${String(v)}`, 4)
      );
      y += 10;
    }

    // Activities
    if (activities.length) {
      addHeader("Available Activities");
      activities.forEach((act, index) =>
        addText(`${index + 1}. ${act.title}`, 4)
      );
    }

    doc.save("travel_summary.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-4">Travel Summary</h1>

        {/* Preferences */}
        {allData.prefs && (
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Preferences</h2>
              {renderObject(allData.prefs)}
            </CardContent>
          </Card>
        )}

        {/* Transport */}
        {allData.transportData && (
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Transport</h2>
              {renderObject(allData.transportData)}
            </CardContent>
          </Card>
        )}

        {/* Hotel */}
        {allData.selectedHotel && (
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Selected Hotel</h2>
              {renderObject(allData.selectedHotel)}
            </CardContent>
          </Card>
        )}

        {/* Activities */}
        {activities.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Available Activities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="border rounded-lg p-3 bg-white shadow-sm"
                  >
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-32 object-cover rounded"
                    />
                    <h3 className="text-lg font-medium mt-2">{act.title}</h3>
                    <p className="text-sm text-gray-600">{act.desc}</p>
                    <p className="text-sm mt-1">
                      <strong>Price:</strong> ₹{act.price} | ⭐ {act.rating} (
                      {act.reviews} reviews)
                    </p>
                    <p className="text-xs text-gray-500">
                      Interest: {act.interest}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Button onClick={handleDownloadPDF} className="mt-4">
            📄 Download Travel PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FullItinerarySummary;

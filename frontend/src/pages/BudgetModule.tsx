import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/background3.jpg";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Category = {
  name: string;
  allocated: number;
  spent: number;
};

type Alert = {
  type: "over";
  category: string;
  amount: number;
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function BudgetModule() {
  const location = useLocation();
  const navigate = useNavigate();

  const prefs =
    (location.state as {
      startDate: string;
      endDate: string;
      budget: number;
      source: string;
      destination: string;
      interests: string[];
      accommodation: string;
      transport: string;
      people?: string;
    }) || JSON.parse(localStorage.getItem("prefs") || "{}");

  const totalBudget = prefs?.budget || 0;

  const initialCategories: Category[] = [
    { name: "Transport", allocated: totalBudget * 0.3, spent: 0 },
    { name: "Accommodation", allocated: totalBudget * 0.35, spent: 0 },
    { name: "Activities", allocated: totalBudget * 0.25, spent: 0 },
    { name: "Miscellaneous", allocated: totalBudget * 0.1, spent: 0 },
  ];

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string>("");

  const addExpense = (categoryName: string, amount: number) => {
    if (amount <= 0) return;
    setCategories(prev =>
      prev.map(cat =>
        cat.name === categoryName ? { ...cat, spent: cat.spent + amount } : cat
      )
    );

    const category = categories.find(c => c.name === categoryName);
    if (category && category.spent + amount > category.allocated) {
      setAlerts(prev => [
        ...prev,
        { type: "over", category: categoryName, amount: category.spent + amount - category.allocated },
      ]);
    }
  };

  const handleNext = () => {
    const hasExpenses = categories.some(cat => cat.spent > 0);
    if (!hasExpenses) {
      setError("⚠️ Please add at least one expense before moving forward.");
      return;
    }
    setError("");
    localStorage.setItem("budgetData", JSON.stringify(categories));
    // ✅ Navigate to Transport Module instead of Itinerary
    navigate("/transport", { state: { prefs, categories } });
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
            Budget Analyzer Module
          </h1>
          <p className="text-center text-sm text-slate-600 mb-6">
            Allocate funds, track expenses vs allocated, and visualize your budget.
          </p>

          {/* Preferences Summary */}
          <div className="mb-6 text-sm space-y-1">
            <p>
              📅 <strong>{prefs.startDate}</strong> → <strong>{prefs.endDate}</strong>
            </p>
            <p>
              📍 From <strong>{prefs.source}</strong> → <strong>{prefs.destination}</strong>
            </p>
            <p>
              🎯 Interests:{" "}
              {prefs.interests && prefs.interests.length > 0 ? prefs.interests.join(", ") : "None selected"}
            </p>
            <p>🏨 Accommodation: {prefs.accommodation || "Not selected"}</p>
            <p>🚗 Transport: {prefs.transport || "Not selected"}</p>
            {prefs.people && <p>👥 Number of People: {prefs.people}</p>}
            <p className="font-semibold">💰 Total Budget: ₹{totalBudget.toLocaleString()}</p>
          </div>

          {/* Budget Allocation */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Budget Allocation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(cat => {
                const progress = Math.min((cat.spent / cat.allocated) * 100, 100);
                return (
                  <div key={cat.name} className="p-4 border rounded-lg bg-white/90 shadow-sm">
                    <p className="font-medium">{cat.name}</p>
                    <p className="text-xs text-slate-600 mb-1">
                      Spent: ₹{cat.spent.toLocaleString()} / Allocated: ₹{cat.allocated.toLocaleString()}
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-3 mb-2 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all ${progress >= 100 ? "bg-red-500" : "bg-green-500"}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Expense"
                        className="border px-2 py-1 rounded w-24 text-sm"
                        id={`expense-${cat.name}`}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById(`expense-${cat.name}`) as HTMLInputElement;
                          const amount = Number(input.value);
                          if (amount > 0) {
                            addExpense(cat.name, amount);
                            input.value = "";
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm">
              <h2 className="text-red-600 font-semibold mb-2">Alerts 🚨</h2>
              <ul className="list-disc list-inside">
                {alerts.map((alert, index) => (
                  <li key={index} className="text-red-600">
                    {alert.category} exceeded by ₹{alert.amount.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pie Chart */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Budget Visualization 🥧</h2>
            <div className="h-60">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categories} dataKey="spent" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                    {categories.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-center text-red-500 text-sm font-medium mb-4">{error}</p>}

          {/* Move to Transport */}
          <div className="text-center">
            <Button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              onClick={handleNext}
            >
              Move to Transport Module →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

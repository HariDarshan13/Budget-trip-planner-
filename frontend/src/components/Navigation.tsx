import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Map } from "lucide-react";

axios.defaults.baseURL = "https://budget-trip-planner-backend.onrender.com";

export default function Navigation() {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState<"signup" | "login" | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "🏠 Home", href: "#hero", type: "scroll" },
    { name: "🌟 Features", href: "#features", type: "scroll" },
    { name: "⚙️ How It Works", href: "#how-it-works", type: "scroll" },
    { name: "🎯 Preferences", href: "/preferences", type: "link" },
    { name: "📞 Contact Us", href: "#contact", type: "scroll" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  const handleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = showAuth === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const res = await axios.post(endpoint, form);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user || res.data);
      setShowAuth(null);
      setForm({ name: "", email: "", password: "" });
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const handleScroll = (id: string) => {
    if (location.pathname !== "/") {
      // Not on homepage → navigate home and scroll after load
      navigate("/");
      setTimeout(() => {
        const target = document.querySelector(id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } else {
      // Already on homepage
      const target = document.querySelector(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Map className="text-blue-600" size={24} />
          <span className="text-2xl font-bold text-blue-600">TripPlan TN</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) =>
            item.type === "link" ? (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
              >
                <span>{item.name}</span>
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={() => handleScroll(item.href)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
              >
                <span>{item.name}</span>
              </button>
            )
          )}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700 font-medium">👋 {user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowAuth("login")}
                className="px-4 py-2 rounded-lg text-blue-600 hover:text-blue-700 font-medium"
              >
                🔑 Sign In
              </button>
              <button
                onClick={() => setShowAuth("signup")}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md"
              >
                🎉 Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Auth modal */}
      {showAuth && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-xl w-80 md:w-96 p-6 transform transition-all duration-300 scale-90 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
              {showAuth === "signup" ? "🎉 Sign Up" : "🔑 Login"}
            </h2>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm mb-3 text-center font-medium">{error}</p>
            )}

            {showAuth === "signup" && (
              <input
                type="text"
                placeholder="🙂 Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-gray-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}

            <input
              type="email"
              placeholder="📧 Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-gray-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="password"
              placeholder="🔒 Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-gray-300 p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-between items-center">
              <button
                onClick={handleAuth}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition duration-200"
              >
                {loading
                  ? "Please wait..."
                  : showAuth === "signup"
                  ? "Sign Up"
                  : "Login"}
              </button>
              <button
                onClick={() => setShowAuth(null)}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition duration-200"
              >
                Cancel
              </button>
            </div>

            {/* Switch between signup/login */}
            {showAuth === "signup" && (
              <p className="text-sm text-gray-600 text-center mt-4">
                Already a user?{" "}
                <button
                  onClick={() => {
                    setShowAuth("login");
                    setError(null);
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login →
                </button>
              </p>
            )}
            {showAuth === "login" && (
              <p className="text-sm text-gray-600 text-center mt-4">
                New here?{" "}
                <button
                  onClick={() => {
                    setShowAuth("signup");
                    setError(null);
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign Up →
                </button>
              </p>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fade-in {
            0% {opacity: 0; transform: scale(0.9);}
            100% {opacity: 1; transform: scale(1);}
          }
          .animate-fade-in {
            animation: fade-in 0.25s ease-out forwards;
          }
        `}
      </style>
    </nav>
  );
}

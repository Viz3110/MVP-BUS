import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import mainImg from "../assets/main.png";
import api from "../services/api";

export default function Home() {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const [user, setUser] = useState(null);   // 👈 changed
  const isLoggedIn = !!localStorage.getItem("token");

  // 🔹 Fetch user from DB using phone
  useEffect(() => {
    if (!isLoggedIn) return;

    const phone = localStorage.getItem("login_phone");
    if (!phone) return;

    const fetchUser = async () => {
      try {
        const res = await api.post("/auth/get-user-by-phone", { phone });
        setUser(res.data.user);
      } catch (err) {
        console.error("USER FETCH ERROR 👉", err?.response?.data || err.message);
      }
    };

    fetchUser();
  }, [isLoggedIn]);

  const handleSearch = () => {
    if (!from || !to || !date) {
      alert("Please fill all fields");
      return;
    }

    navigate(`/search?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200">

      {/* ================= NAVBAR ================= */}
      <header className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-xl px-6 py-3 shadow">

          <h1 className="text-2xl font-bold text-green-700">GE🌍BUS</h1>

          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
            <span className="cursor-pointer hover:text-green-600">About Us</span>
            <span className="cursor-pointer hover:text-green-600">Services</span>
            <span className="cursor-pointer hover:text-green-600">My Bookings</span>
            <span className="cursor-pointer hover:text-green-600">Track My Bus</span>
            <span className="cursor-pointer hover:text-green-600">Support</span>
          </nav>

          {isLoggedIn ? (
  <div className="flex items-center gap-3">
    <span className="text-sm font-medium text-gray-700">
      {user?.name ||
        JSON.parse(localStorage.getItem("user"))?.name ||
        "User"}
    </span>

    <img
      src={
        user?.avatar ||
        JSON.parse(localStorage.getItem("user"))?.avatar ||
        "https://i.pravatar.cc/40"
      }
      className="w-9 h-9 rounded-full border cursor-pointer"
      alt="User Profile"
    />
  </div>
) : (
  <button
    onClick={() => navigate("/login")}
    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
  >
    Sign In
  </button>
)}


        </div>
      </header>

      {/* ================= HERO ================= */}
      <main className="max-w-7xl mx-auto px-6 pt-8 pb-20">

        <div className="flex justify-center mb-10">
          <img
            src={mainImg}
            alt="GeoBus Illustration"
            className="max-w-4xl w-full"
          />
        </div>

        {/* ================= SEARCH CARD ================= */}
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500">FROM</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                <span className="mr-2">🚌</span>
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="eg: Chennai, Tamilnadu"
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500">TO</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                <span className="mr-2">🚌</span>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="eg: Bangalore, Karnataka"
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500">
                DATE OF JOURNEY
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                <span className="mr-2">📅</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleSearch}
              className="bg-indigo-900 hover:bg-indigo-800 text-white px-10 py-3 rounded-full text-sm font-semibold shadow"
            >
              Search
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function MyTrips() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("upcoming");
  const [trips, setTrips] = useState({ upcoming: [], completed: [] });
  const [loading, setLoading] = useState(true);

  // TEMP userId (replace with auth later)
  const userId = 1;

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get(`/api/booking/user/${userId}`);
        const bookings = res.data.bookings || [];

        const upcoming = [];
        const completed = [];

        bookings.forEach((b) => {
          const trip = {
            id: b.id,
            route: b.bus?.busName || "Bus Trip",
            departure: new Date(b.createdAt).toLocaleString(),
            seats: b.seats.join(", "),
          };

          b.status === "CONFIRMED"
            ? upcoming.push(trip)
            : completed.push(trip);
        });

        setTrips({ upcoming, completed });
      } catch {
        alert("Failed to load trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const activeTrips = trips[tab];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your trips...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3FBF6] flex">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-60 bg-white shadow-lg p-6">
        <h2 className="font-bold text-lg mb-6 text-green-700">YOUR BOOKINGS</h2>

        <nav className="space-y-3 text-sm">
          {["Trips", "Dashboard", "Drivers", "Customers"].map((item) => (
            <div
              key={item}
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                item === "Trips"
                  ? "bg-green-600 text-white"
                  : "hover:bg-green-100"
              }`}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-10">

        {/* HEADER */}
        <div className="bg-green-800 text-white py-4 px-6 rounded-xl mb-8">
          <h1 className="text-xl font-semibold">MY TRIPS</h1>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("upcoming")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              tab === "upcoming"
                ? "bg-green-600 text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            Upcoming Trips
          </button>

          <button
            onClick={() => setTab("completed")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              tab === "completed"
                ? "bg-green-600 text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            Completed Trips
          </button>
        </div>

        {/* EMPTY STATE */}
        {activeTrips.length === 0 && (
          <div className="text-gray-500 text-center mt-10">
            No trips found
          </div>
        )}

        {/* TRIP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTrips.map((trip, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow p-6"
            >
              <p className="text-xs text-gray-500 mb-1">
                Trip ID: {trip.id}
              </p>

              <h3 className="text-lg font-semibold text-green-700 mb-2">
                {trip.route}
              </h3>

              <p className="text-sm text-gray-600">
                Departure: {trip.departure}
              </p>

              <p className="text-sm text-gray-600 mb-4">
                Seats: {trip.seats}
              </p>

              <button
                onClick={() => navigate(`/ticket/${trip.id}`)}
                className="px-5 py-2 bg-green-600 text-white rounded-full text-sm hover:bg-green-700"
              >
                VIEW E-TICKET
              </button>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

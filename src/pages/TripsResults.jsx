import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function TripsResults() {
  /* ================= URL PARAMS ================= */
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const from = params.get("from");
  const to = params.get("to");
  const date = params.get("date");

  /* ================= STATE ================= */
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");

  /* ================= REAL API FETCH ================= */
  useEffect(() => {
    if (!from || !to || !date) {
      setLoading(false);
      return;
    }

    const fetchTrips = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/api/trips/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`
        );

        setTrips(res.data.trips || []);
      } catch (err) {
        console.error("TRIPS FETCH ERROR 👉", err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [from, to, date]);

  /* ================= SORT LOGIC ================= */
  const sortedTrips = [...trips].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "departure")
    return a.departureTime.localeCompare(b.departureTime);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 p-6">
      {/* ================= TOP SEARCH BAR ================= */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-4 items-center">
        <input className="border rounded px-4 py-2 w-1/4" defaultValue={from || ""} />
        <span className="text-xl">⇄</span>
        <input className="border rounded px-4 py-2 w-1/4" defaultValue={to || ""} />
        <input type="date" className="border rounded px-4 py-2 w-1/4" defaultValue={date || ""} />
        <button className="bg-indigo-900 text-white px-5 py-2 rounded-lg">🔍</button>
      </div>

      <div className="flex gap-6">
        {/* ================= FILTER PANEL ================= */}
        <aside className="w-64 bg-white rounded-xl shadow p-4 h-fit">
          <h3 className="font-bold mb-4">FILTER BUSES</h3>

          {[
            "Sleeper (34)",
            "AC (45)",
            "Single Seats (20)",
            "Non AC (18)",
            "Volvo Buses (25)",
            "Free Cancellation (15)",
            "High Rated Buses (38)",
            "Live Tracking (49)",
          ].map((f) => (
            <div key={f} className="mb-2">
              <button className="w-full text-left px-3 py-2 rounded bg-green-50 hover:bg-green-100 text-sm">
                {f}
              </button>
            </div>
          ))}
        </aside>

        {/* ================= RESULTS ================= */}
        <main className="flex-1">
          {/* HEADER */}
          <div className="bg-white rounded-xl shadow px-6 py-3 flex justify-between items-center mb-4">
            <p className="font-semibold">
              {sortedTrips.length} Buses Found • {from} → {to}
            </p>

            <div className="flex gap-4 text-sm">
              <button onClick={() => setSortBy("rating")}>Ratings</button>
              <button onClick={() => setSortBy("departure")}>Departure Time</button>
              <button onClick={() => setSortBy("price")}>Price</button>
            </div>
          </div>

          {/* BOARDING POINTS */}
          <div className="bg-white rounded-xl shadow px-6 py-3 mb-4">
            <p className="text-sm font-semibold mb-2">Where do you want to board?</p>

            <div className="flex flex-wrap gap-2">
              {[
                "Maduravoyal (88)",
                "Poonamallee (82)",
                "Sriperumbudur (81)",
                "Maduravoyal (80)",
                "Ekkattuthangal (72)",
              ].map((p) => (
                <span
                  key={p}
                  className="px-3 py-1 text-sm rounded-full border bg-green-50"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* RESULTS LIST */}
          {loading ? (
            <p className="text-center py-10">Loading buses...</p>
          ) : (
            sortedTrips.map((bus) => (
              <div
                key={bus.id}
                className="bg-white rounded-xl shadow p-5 mb-4 flex justify-between items-center"
              >
                {/* LEFT */}
                <div>
                  <h3 className="font-bold">{bus.busName}</h3>

                  {/* ✅ CHANGE 1: seats badge */}
                  <span className="text-xs bg-green-100 px-2 py-1 rounded inline-block mt-1">
                    {bus.availableSeats} seats left
                  </span>

                  <div className="flex gap-2 mt-2">
                    {(bus.tags || []).map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-green-100 px-2 py-1 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {bus.offer && (
                    <p className="text-xs text-pink-600 mt-2">{bus.offer}</p>
                  )}
                </div>

{/* CENTER */}
<div className="flex flex-col items-center justify-center text-center min-w-[180px]">
  <p className="text-lg font-semibold text-gray-800">
    {bus.departureTime || "--:--"}
    <span className="mx-2">→</span>
    {bus.arrivalTime || "--:--"}
  </p>
  <p className="text-xs text-gray-500 mt-1">
    Departure → Arrival
  </p>
</div>


                {/* RIGHT */}
                <div className="text-right">
                  <p className="text-lg font-bold">₹{bus.price}</p>
                  <button
                    onClick={() => navigate(`/seats/${bus.id}`)}
                    className="mt-2 bg-indigo-900 text-white px-5 py-2 rounded-full"
                  >
                    View Seats
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}

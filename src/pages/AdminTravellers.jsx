import { useState, useMemo } from "react";

export default function AdminTravellers() {
  const [showDetails, setShowDetails] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedTraveller, setSelectedTraveller] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const [travellers, setTravellers] = useState([
    {
      bookingId: "Inter2024G01",
      user: "98765-XXXX",
      bus: "Intercity Gold",
      route: "Delhi → Jaipur",
      date: "2024-03-30",
      startTime: "06:00",
      seats: "A1, A2",
      price: 2400,
      status: "Active",
    },
    {
      bookingId: "BK202402",
      user: "555-XXXX",
      bus: "Night Rider",
      route: "Bangalore → Chennai",
      date: "2024-03-28",
      startTime: "22:00",
      seats: "C3",
      price: 1800,
      status: "Active",
    },
    {
      bookingId: "BK202403",
      user: "45678-XXXX",
      bus: "Local Shuttle",
      route: "Pune → Goa",
      date: "2024-04-01",
      startTime: "08:00",
      seats: "B5",
      price: 999,
      status: "Cancelled",
    },
  ]);

  const [form, setForm] = useState({
    bookingId: "",
    user: "",
    bus: "",
    route: "",
    date: "",
    startTime: "",
    seats: "",
    price: "",
    status: "Active",
  });

  /* ================= SEARCH ================= */
  const filteredTravellers = useMemo(() => {
    return travellers.filter(
      (t) =>
        t.route.toLowerCase().includes(search.toLowerCase()) ||
        t.bookingId.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, travellers]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredTravellers.length / rowsPerPage);
  const paginatedTravellers = filteredTravellers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* ================= ADD TRAVELLER ================= */
  const handleAddTraveller = () => {
    if (!form.bookingId || !form.user || !form.route) {
      alert("Fill all required fields");
      return;
    }

    setTravellers([...travellers, form]);
    setForm({
      bookingId: "",
      user: "",
      bus: "",
      route: "",
      date: "",
      startTime: "",
      seats: "",
      price: "",
      status: "Active",
    });
    setShowAdd(false);
  };

  /* ================= DELETE TRAVELLER ================= */
  const handleDelete = (index) => {
    if (!confirm("Delete this traveller?")) return;
    setTravellers(travellers.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 bg-[#F7F9FB] min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Travellers</h1>
          <p className="text-gray-500 text-sm">
            View and manage all traveller bookings and seat allocations.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow"
        >
          + Add Traveller
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="flex gap-4 mb-5">
        <input
          placeholder="Search by booking or route..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-64"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Booking ID",
                "User",
                "Route",
                "Date",
                "Start Time",
                "Seats",
                "Price",
                "Status",
                "Action",
              ].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedTravellers.map((t, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-blue-600">
                  {t.bookingId}
                </td>
                <td className="px-4 py-3">{t.user}</td>
                <td className="px-4 py-3">{t.route}</td>
                <td className="px-4 py-3">{t.date}</td>
                <td className="px-4 py-3">{t.startTime}</td>
                <td className="px-4 py-3">{t.seats}</td>
                <td className="px-4 py-3">₹ {t.price}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      t.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>

                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedTraveller(t);
                      setShowDetails(true);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(i)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center gap-2 mt-6">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ================= ADD TRAVELLER MODAL ================= */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50">
          <div className="bg-white w-[420px] h-full p-6 shadow-xl overflow-y-auto">

            <h2 className="text-lg font-bold mb-4">Add Traveller</h2>

            {[
              ["Booking ID", "bookingId"],
              ["User", "user"],
              ["Bus", "bus"],
              ["Route", "route"],
              ["Date", "date"],
              ["Start Time", "startTime"],
              ["Seats", "seats"],
              ["Price", "price"],
            ].map(([label, key]) => (
              <div key={key} className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">
                  {label}
                </label>
                <input
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            ))}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAdd(false)}
                className="w-1/2 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddTraveller}
                className="w-1/2 bg-green-600 text-white py-2 rounded-lg"
              >
                Save Traveller
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= VIEW DETAILS PANEL ================= */}
      {showDetails && selectedTraveller && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50">
          <div className="bg-white w-[420px] h-full p-6 shadow-xl overflow-y-auto">

            <h2 className="text-lg font-bold mb-4">Traveller Details</h2>

            {[
              ["Booking ID", selectedTraveller.bookingId],
              ["Bus Name", selectedTraveller.bus],
              ["Route", selectedTraveller.route],
              ["Date", selectedTraveller.date],
              ["Start Time", selectedTraveller.startTime],
              ["Seats", selectedTraveller.seats],
              ["User", selectedTraveller.user],
              ["Price", `₹ ${selectedTraveller.price}`],
            ].map(([label, value]) => (
              <div key={label} className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">
                  {label}
                </label>
                <input
                  value={value}
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
                />
              </div>
            ))}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="w-full py-2 border rounded-lg"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

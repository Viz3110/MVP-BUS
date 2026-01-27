import { useState, useMemo } from "react";

export default function AdminTrips() {
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [trips, setTrips] = useState([
    {
      id: "TRIP001",
      bus: "Intercity Gold",
      operator: "Blue Star Transit",
      seats: 30,
      route: "Delhi → Jaipur",
      startTime: "06:00",
      price: 900,
      status: "Active",
      date: "2024-03-15",
    },
    {
      id: "TRIP002",
      bus: "Night Rider",
      operator: "Apex Logistics",
      seats: 45,
      route: "Bangalore → Chennai",
      startTime: "22:00",
      price: 1800,
      status: "Inactive",
      date: "2024-03-20",
    },
  ]);

  const [form, setForm] = useState({
    id: "",
    bus: "",
    operator: "",
    seats: "",
    route: "",
    startTime: "",
    price: "",
    status: true,
    date: "",
  });

  /* ================= SEARCH + FILTER ================= */
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        trip.bus.toLowerCase().includes(search.toLowerCase()) ||
        trip.route.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === "All" || trip.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus, trips]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredTrips.length / rowsPerPage);
  const paginatedTrips = filteredTrips.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* ================= SAVE TRIP ================= */
  const handleSave = () => {
    const newTrip = {
      ...form,
      status: form.status ? "Active" : "Inactive",
    };

    if (editIndex !== null) {
      const updated = [...trips];
      updated[editIndex] = newTrip;
      setTrips(updated);
    } else {
      setTrips([...trips, newTrip]);
    }

    setShowForm(false);
    setEditIndex(null);
    setForm({
      id: "",
      bus: "",
      operator: "",
      seats: "",
      route: "",
      startTime: "",
      price: "",
      status: true,
      date: "",
    });
  };

  /* ================= EDIT ================= */
  const handleEdit = (trip, index) => {
    setForm({
      ...trip,
      status: trip.status === "Active",
    });
    setEditIndex(index);
    setShowForm(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = (index) => {
    if (!confirm("Delete this trip?")) return;
    setTrips(trips.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 bg-[#F7F9FB] min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Trips</h1>
          <p className="text-gray-500 text-sm">
            View and manage all trip records, including schedules and availability.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + Add New Trip
        </button>
      </div>

      {/* ================= SEARCH + FILTER ================= */}
      <div className="flex gap-4 mb-5">
        <input
          type="text"
          placeholder="Search by bus or route..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-64"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Trip ID",
                "Bus",
                "Operator",
                "Seats",
                "Route",
                "Start Time",
                "Price",
                "Status",
                "Actions",
              ].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedTrips.map((trip, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-blue-600">{trip.id}</td>
                <td className="px-4 py-3">{trip.bus}</td>
                <td className="px-4 py-3">{trip.operator}</td>
                <td className="px-4 py-3">{trip.seats}</td>
                <td className="px-4 py-3">{trip.route}</td>
                <td className="px-4 py-3">{trip.startTime}</td>
                <td className="px-4 py-3">₹ {trip.price}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      trip.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {trip.status}
                  </span>
                </td>

                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(trip, i)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-xs"
                  >
                    Edit
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

      {/* ================= MODAL FORM ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50">
          <div className="bg-white w-[420px] h-full p-6 shadow-xl overflow-y-auto">

            <h2 className="text-lg font-bold mb-4">
              {editIndex !== null ? "Edit Trip" : "Add New Trip"}
            </h2>

            {[
              ["Trip ID", "id"],
              ["Bus Name", "bus"],
              ["Operator", "operator"],
              ["Total Seats", "seats"],
              ["Route", "route"],
              ["Start Time", "startTime"],
              ["Date", "date"],
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

            {/* STATUS TOGGLE */}
            <div className="flex items-center justify-between my-4">
              <span>Status</span>
              <button
                onClick={() => setForm({ ...form, status: !form.status })}
                className={`w-12 h-6 rounded-full p-1 ${
                  form.status ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full ${
                    form.status ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="w-1/2 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="w-1/2 bg-green-600 text-white py-2 rounded-lg"
              >
                Save Trip
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

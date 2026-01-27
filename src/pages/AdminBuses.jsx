import { useState, useMemo, useEffect } from "react";
import api from "../services/api";

export default function AdminBuses() {
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [buses, setBuses] = useState([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    operator: "",
    totalSeats: "",
    route: "",
    price: "",
    status: true,
    acType: "",
    amenities: "",
    departure: "",
    arrival: "",
    rating: "",
  });

  // ---------------- API ----------------
  const fetchBuses = async () => {
    try {
      const res = await api.get("/admin/buses"); // ✅ FIXED
      setBuses(res.data.buses);
    } catch (err) {
      alert("Failed to load buses");
    }
  };

  // ---------------- EFFECT ----------------
  useEffect(() => {
    fetchBuses();
  }, []);

  /* ================= SEARCH + FILTER ================= */
  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
      const matchesSearch =
        bus.busName?.toLowerCase().includes(search.toLowerCase()) ||
        `${bus.from} → ${bus.to}`.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === "All" || bus.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus, buses]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredBuses.length / rowsPerPage);
  const paginatedBuses = filteredBuses.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* ================= SAVE BUS ================= */
  const handleSave = async () => {
    try {
      const payload = {
        busNumber: form.id,
        busName: form.name,
        from: form.route.split("→")[0]?.trim(),
        to: form.route.split("→")[1]?.trim(),
        totalSeats: Number(form.totalSeats),
        type: form.acType,
      };

      if (editIndex !== null) {
        await api.put(`/admin/buses/${buses[editIndex].id}`, payload); // ✅ FIXED
      } else {
        await api.post("/admin/buses", payload); // ✅ FIXED
      }

      await fetchBuses();
      setShowForm(false);
      setEditIndex(null);
      setForm({
        id: "",
        name: "",
        totalSeats: "",
        route: "",
        acType: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (bus, index) => {
    setForm({
      id: bus.busNumber,
      name: bus.busName,
      totalSeats: bus.totalSeats,
      route: `${bus.from} → ${bus.to}`,
      acType: bus.type,
    });
    setEditIndex(index);
    setShowForm(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this bus?")) return;
    try {
      await api.delete(`/admin/buses/${id}`); // ✅ FIXED
      fetchBuses();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-8 bg-[#F7F9FB] min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Buses</h1>
          <p className="text-gray-500 text-sm">
            View and manage all bus records, including routes and availability.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + Add New Bus
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
                "Bus ID",
                "Bus Name",
                "Operator",
                "Seats",
                "Route",
                "AC",
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
            {paginatedBuses.map((bus, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-blue-600">{bus.id}</td>
                <td className="px-4 py-3">{bus.name}</td>
                <td className="px-4 py-3">{bus.operator}</td>
                <td className="px-4 py-3">{bus.totalSeats}</td>
                <td className="px-4 py-3">{bus.route}</td>
                <td className="px-4 py-3">{bus.acType}</td>
                <td className="px-4 py-3">₹ {bus.price}</td>
                <td className="px-4 py-3">{bus.from} → {bus.to}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      bus.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {bus.status}
                  </span>
                </td>

                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(bus, i)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(bus.id)}
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
              {editIndex !== null ? "Edit Bus" : "Add New Bus"}
            </h2>

            {[
              ["Bus ID", "id"],
              ["Bus Name", "name"],
              ["Operator", "operator"],
              ["Total Seats", "totalSeats"],
              ["Route", "route"],
              ["AC Type", "acType"],
              ["Amenities", "amenities"],
              ["Departure Time", "departure"],
              ["Arrival Time", "arrival"],
              ["Rating", "rating"],
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
                onClick={() => setShowForm(false)}
                className="w-1/2 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="w-1/2 bg-green-600 text-white py-2 rounded-lg"
              >
                Save Bus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

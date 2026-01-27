import { useState, useMemo } from "react";

export default function AdminSearchLogs() {
  const [showFilter, setShowFilter] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // ✅ SORT STATE
  const [sortBy, setSortBy] = useState({ key: null, dir: "asc" });

  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const [logs, setLogs] = useState([
    { from: "Mumbai", to: "Mumbai", seats: 30, date: "2024-07-26", route: "Mumbai → Mumbai", price: "₹1200", status: "Active" },
    { from: "Operator", to: "Pune", seats: 45, date: "2024-07-25", route: "Delhi → Jaipur", price: "₹1800", status: "Active" },
    { from: "Operator", to: "Jaipur", seats: 45, date: "2024-07-26", route: "₹1300", price: "₹1300", status: "Active" },
    { from: "Delhi", to: "2024-07-26", seats: 25, date: "2024-07-26", route: "14-45005", price: "₹950", status: "Inactive" },
    { from: "Jaipur", to: "Jaipur", seats: 30, date: "2024-07-26", route: "Jaipur → Jaipur", price: "₹1500", status: "Inactive" },
    { from: "Bangalore", to: "Pune-07-25", seats: 36, date: "2024-07-25", route: "10 010007", price: "₹1800", status: "Active" },
    { from: "Goa", to: "USER007", seats: 40, date: "2024-07-28", route: "Pune → Viade", price: "₹1122", status: "Active" },
    { from: "Cancelled", to: "Ugma", seats: 40, date: "2024-07-20", route: "Cancelled", price: "₹1222", status: "Active" },
  ]);

  /* ================= FILTER + SORT ================= */
  const processedLogs = useMemo(() => {
    let data = logs.filter((log) => {
      const matchesSearch =
        log.from.toLowerCase().includes(search.toLowerCase()) ||
        log.to.toLowerCase().includes(search.toLowerCase()) ||
        log.route.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === "All" || log.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    if (sortBy.key) {
      data.sort((a, b) => {
        let valA = a[sortBy.key];
        let valB = b[sortBy.key];

        // handle price sorting
        if (sortBy.key === "price") {
          valA = parseInt(valA.replace("₹", ""));
          valB = parseInt(valB.replace("₹", ""));
        }

        if (sortBy.dir === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
    }

    return data;
  }, [search, filterStatus, logs, sortBy]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(processedLogs.length / rowsPerPage);
  const paginatedLogs = processedLogs.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* ================= ANALYTICS ================= */
  const analytics = useMemo(() => {
    const total = logs.length;
    const active = logs.filter((l) => l.status === "Active").length;
    const inactive = total - active;

    const avgPrice =
      logs.reduce(
        (sum, l) => sum + parseInt(l.price.replace("₹", "")),
        0
      ) / total;

    const routeCount = {};
    logs.forEach((l) => {
      routeCount[l.route] = (routeCount[l.route] || 0) + 1;
    });

    const topRoute = Object.entries(routeCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    return { total, active, inactive, avgPrice, topRoute };
  }, [logs]);

  /* ================= SORT HANDLER ================= */
  const handleSort = (key) => {
    setSortBy((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const header = "From,To,Seats,Date,Route,Price,Status\n";
    const rows = logs
      .map((l) => `${l.from},${l.to},${l.seats},${l.date},${l.route},${l.price},${l.status}`)
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "search_logs.csv";
    link.click();
  };

  const resetFilters = () => {
    setFilterStatus("All");
    setSearch("");
    setShowFilter(false);
  };

  return (
    <div className="p-8 bg-[#F7F9FB] min-h-screen">

      {/* ================= ANALYTICS ================= */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Searches", value: analytics.total },
          { label: "Active Searches", value: analytics.active },
          { label: "Inactive Searches", value: analytics.inactive },
          { label: "Avg Price", value: `₹${Math.round(analytics.avgPrice)}` },
        ].map((c) => (
          <div key={c.label} className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">{c.label}</p>
            <h2 className="text-2xl font-bold text-green-600">{c.value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <p className="text-sm text-gray-500">Most Searched Route</p>
        <h2 className="text-lg font-semibold">{analytics.topRoute}</h2>
      </div>

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Search Logs</h1>
          <p className="text-gray-500 text-sm">
            View and manage all bus search records.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowFilter(true)}
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            + Search
          </button>

          <button
            onClick={exportCSV}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            + Export Logs
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("from")}>From ⇅</th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("to")}>To ⇅</th>
              <th className="px-4 py-3">Seats</th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("date")}>Date ⇅</th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("route")}>Route ⇅</th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("price")}>Price ⇅</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedLogs.map((l, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{l.from}</td>
                <td className="px-4 py-3">{l.to}</td>
                <td className="px-4 py-3">{l.seats}</td>
                <td className="px-4 py-3">{l.date}</td>
                <td className="px-4 py-3">{l.route}</td>
                <td className="px-4 py-3">{l.price}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      l.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {l.status}
                  </span>
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
              page === i + 1 ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ================= FILTER PANEL ================= */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50">
          <div className="bg-white w-[420px] h-full p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-4">Filter Search Logs</h2>

            <input
              placeholder="Route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-6"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <div className="flex gap-3">
              <button onClick={resetFilters} className="w-1/2 border py-2 rounded-lg">
                Reset
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="w-1/2 bg-green-600 text-white py-2 rounded-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

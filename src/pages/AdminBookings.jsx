import { useState, useMemo } from "react";

export default function AdminBookings() {
  const [showDetails, setShowDetails] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showSeats, setShowSeats] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const [form, setForm] = useState({
    id: "",
    user: "",
    bus: "",
    route: "",
    date: "",
    startTime: "",
    price: "",
    seats: "",
    status: "Active",
  });

  const [bookings, setBookings] = useState([
    {
      id: "BK202401",
      user: "98765-XXXX",
      bus: "Intercity Gold",
      route: "Delhi → Jaipur",
      date: "2024-03-30",
      startTime: "06:00",
      price: 2400,
      seats: "A1, A2",
      status: "Active",
    },
    {
      id: "BK202402",
      user: "555-XXXX",
      bus: "Night Rider",
      route: "Bangalore → Chennai",
      date: "2024-03-28",
      startTime: "22:00",
      price: 1800,
      seats: "C3",
      status: "Refunded",
    },
  ]);

  /* ================= SEARCH + FILTER ================= */
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.route.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === "All" || b.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [search, filterStatus, bookings]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* ================= ADD BOOKING ================= */
  const handleAddBooking = () => {
    if (!form.id || !form.user || !form.bus) return alert("Fill all fields");
    setBookings([...bookings, form]);
    setShowAdd(false);
    setForm({
      id: "",
      user: "",
      bus: "",
      route: "",
      date: "",
      startTime: "",
      price: "",
      seats: "",
      status: "Active",
    });
  };

  /* ================= REFUND LOGIC ================= */
  const processRefund = () => {
    const updated = bookings.map((b) =>
      b.id === selectedBooking.id ? { ...b, status: "Refunded" } : b
    );
    setBookings(updated);
    setShowDetails(false);
    alert("Refund Processed ✅");
  };

  return (
    <div className="p-8 bg-[#F7F9FB] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Bookings</h1>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-600 text-white px-5 py-2 rounded-lg"
        >
          + Add Booking
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mb-5">
        <input
          placeholder="Search booking..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option>All</option>
          <option>Active</option>
          <option>Cancelled</option>
          <option>Refunded</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["ID", "User", "Route", "Price", "Seats", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.map((b, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3 text-blue-600 font-semibold">{b.id}</td>
                <td className="px-4 py-3">{b.user}</td>
                <td className="px-4 py-3">{b.route}</td>
                <td className="px-4 py-3">₹{b.price}</td>
                <td className="px-4 py-3">{b.seats}</td>
                <td className="px-4 py-3">{b.status}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setSelectedBooking(b); setShowInvoice(true); }} className="bg-blue-500 text-white px-3 py-1 rounded">Invoice</button>
                  <button onClick={() => { setSelectedBooking(b); setShowSeats(true); }} className="bg-purple-500 text-white px-3 py-1 rounded">Seats</button>
                  <button onClick={() => { setSelectedBooking(b); setShowDetails(true); }} className="bg-green-600 text-white px-3 py-1 rounded">Refund</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-6">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${page === i + 1 ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ================= ADD BOOKING MODAL ================= */}
{showAdd && (
  <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
    <div className="bg-white w-[380px] h-full p-6">
      <h2 className="font-bold mb-4">Add Booking</h2>

      {["id","user","bus","route","date","startTime","price","seats"].map((key) => (
        <input
          key={key}
          placeholder={key.toUpperCase()}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full border rounded px-3 py-2 mb-3"
        />
      ))}

      {/* ✅ ACTION BUTTONS */}
      <div className="flex gap-3 mt-4">

        {/* ✅ CANCEL BUTTON */}
        <button
          onClick={() => setShowAdd(false)}
          className="w-1/2 border py-2 rounded"
        >
          Cancel
        </button>

        {/* ✅ SAVE BUTTON */}
        <button
          onClick={handleAddBooking}
          className="w-1/2 bg-green-600 text-white py-2 rounded"
        >
          Save
        </button>
      </div>

      {/* ✅ REMOVE BOOKING BUTTON */}
      <button
        onClick={() => {
          const updated = bookings.filter((b) => b.id !== form.id);
          setBookings(updated);
          setShowAdd(false);
          alert("Booking Removed ✅");
        }}
        className="mt-4 w-full bg-red-600 text-white py-2 rounded"
      >
        Remove Booking
      </button>
    </div>
  </div>
)}


      {/* ================= INVOICE PREVIEW ================= */}
      {showInvoice && selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[350px]">
            <h2 className="font-bold mb-3">Booking Invoice</h2>
            <p>ID: {selectedBooking.id}</p>
            <p>User: {selectedBooking.user}</p>
            <p>Route: {selectedBooking.route}</p>
            <p>Seats: {selectedBooking.seats}</p>
            <p>Total: ₹{selectedBooking.price}</p>

            <button onClick={() => setShowInvoice(false)} className="mt-4 bg-green-600 text-white w-full py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= SEAT LAYOUT ================= */}
      {showSeats && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[300px]">
            <h2 className="font-bold mb-3">Seat Layout</h2>
            <div className="grid grid-cols-4 gap-2">
              {["A1","A2","B1","B2","C1","C2"].map(seat => (
                <div key={seat} className="border py-2 text-center bg-green-100">{seat}</div>
              ))}
            </div>
            <button onClick={() => setShowSeats(false)} className="mt-4 bg-green-600 text-white w-full py-2 rounded">Close</button>
          </div>
        </div>
      )}

      {/* ================= REFUND CONFIRM ================= */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[320px]">
            <h2 className="font-bold mb-4">Process Refund?</h2>
            <button onClick={processRefund} className="bg-red-600 text-white w-full py-2 rounded mb-2">Confirm Refund</button>
            <button onClick={() => setShowDetails(false)} className="w-full border py-2 rounded">Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminHome() {
  return (
    <>
      {/* ========== DASHBOARD TITLE ========== */}
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* ========== STATS CARDS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-2xl shadow">
          <p className="text-gray-600">Total Travellers</p>
          <h3 className="text-3xl font-bold mt-2">12,500</h3>
          <p className="text-green-600 mt-1">+5% last week</p>
        </div>

        <div className="bg-green-100 p-6 rounded-2xl shadow">
          <p className="text-gray-600">Total Bookings</p>
          <h3 className="text-3xl font-bold mt-2">8,920</h3>
          <p className="text-green-600 mt-1">+12% last month</p>
        </div>

        <div className="bg-orange-100 p-6 rounded-2xl shadow">
          <p className="text-gray-600">Total Revenue</p>
          <h3 className="text-3xl font-bold mt-2">₹4,50,800</h3>
          <p className="text-red-500 mt-1">-3% last month</p>
        </div>
      </div>

      {/* ================= RECENT BOOKINGS ================= */}
      <div className="bg-white rounded-2xl shadow p-6 mb-10">
        <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-3">Booking ID</th>
                <th className="p-3">User Phone</th>
                <th className="p-3">Seats</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {[
                ["BKID005", "555-123-4567", "A1, A2", "₹1200", "Paid", "2024-12-15"],
                ["BKID004", "555-987-7890", "C4", "₹560", "Pending", "2024-12-14"],
                ["BKID003", "555-456-7890", "D5", "₹720", "Paid", "2024-12-13"],
                ["BKID002", "555-421-0193", "F5", "₹900", "Failed", "2024-12-12"],
              ].map((row, i) => (
                <tr key={i} className="border-t">
                  {row.map((cell, j) => (
                    <td key={j} className="p-3">
                      <span
                        className={
                          cell === "Paid"
                            ? "text-green-600"
                            : cell === "Pending"
                            ? "text-orange-500"
                            : cell === "Failed"
                            ? "text-red-500"
                            : ""
                        }
                      >
                        {cell}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= EXTRA ADMIN SECTIONS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-4">Recent User Activity</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>✅ New user registered</li>
            <li>✅ Booking completed</li>
            <li>❌ Payment failed</li>
            <li>✅ Ticket scanned</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-4">System Status</h3>
          <p className="text-sm">Server: ✅ Online</p>
          <p className="text-sm">Payment Gateway: ✅ Active</p>
          <p className="text-sm">Notification Service: ✅ Active</p>
        </div>
      </div>
    </>
  );
}

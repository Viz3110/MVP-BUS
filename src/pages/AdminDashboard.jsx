import { NavLink, Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-emerald-950 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold flex items-center gap-2 border-b border-white/10">
          🌎 BUS ADMIN
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            ["Dashboard", ""],
            ["Buses", "buses"],
            ["Trips", "trips"],
            ["Bookings", "bookings"],
            ["Travellers", "travellers"],
            ["Search Logs", "search-logs"],
          ].map(([label, path]) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `w-full block text-left px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md"
                    : "hover:bg-white/10"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <button className="w-full mt-10 text-left px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition">
            Logout
          </button>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8">

        {/* ========== HEADER ========== */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold bg-white px-6 py-3 rounded-xl shadow">
            Welcome, Admin!
          </h1>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow">
            <span className="font-medium">Admin</span>
            <img
              src="https://i.pravatar.cc/40"
              className="w-9 h-9 rounded-full"
            />
          </div>
        </div>

        {/* 🔥 CHILD ROUTES LOAD HERE */}
        <Outlet />

      </main>
    </div>
  );
}

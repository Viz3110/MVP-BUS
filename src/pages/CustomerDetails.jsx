import { useState } from "react";
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
export default function AdminCustomerDetails() {
  const [activeBookingTab, setActiveBookingTab] = useState("upcoming");
  const [activePaymentTab, setnsetActivePaymentTab] = useState("cards");

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-screen">

      {/* ================= PAGE TITLE ================= */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Customer Details
      </h1>

      {/* ================= CUSTOMER CARD ================= */}
      <div className="bg-white rounded-2xl border border-green-300 p-6 mb-6 shadow-sm">

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold">
            JD
          </div>

          <div>
            <h2 className="text-lg font-semibold">John Doe</h2>
            <p className="text-sm text-gray-500">CUST-007</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            📞 john.doe@email.com
          </div>
          <div className="flex items-center gap-2">
            ✉️ +91 98765 43210
          </div>
          <div className="flex items-center gap-2">
            📍 123 Bus Route, Cityville
          </div>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ================= BOOKING HISTORY ================= */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Booking History</h3>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveBookingTab("upcoming")}
              className={`px-4 py-1 rounded-full text-sm ${
                activeBookingTab === "upcoming"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Upcoming Trips
            </button>

            <button
              onClick={() => setActiveBookingTab("completed")}
              className={`px-4 py-1 rounded-full text-sm ${
                activeBookingTab === "completed"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Completed Trips
            </button>
          </div>

          <ul className="space-y-3 text-sm">
            <li className="border rounded-lg p-3">
              <p className="font-medium">TRIP-2023-01-15</p>
              <p className="text-gray-500">
                Route: Downtown Express<br />
                Date: 2023-01-15 • Completed
              </p>
            </li>

            <li className="border rounded-lg p-3">
              <p className="font-medium">TRIP-2022-12-01</p>
              <p className="text-gray-500">
                Route: Airport Shuttle<br />
                Date: 2022-12-01 • Completed
              </p>
            </li>
          </ul>
        </div>

        {/* ================= PAYMENT INFO ================= */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Payment Information</h3>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActivePaymentTab("cards")}
              className={`px-4 py-1 rounded-full text-sm ${
                activePaymentTab === "cards"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Saved Cards
            </button>

            <button
              onClick={() => setActivePaymentTab("transactions")}
              className={`px-4 py-1 rounded-full text-sm ${
                activePaymentTab === "transactions"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Transaction Log
            </button>
          </div>

          <ul className="space-y-3 text-sm">
            <li className="border rounded-lg p-3 flex justify-between">
              <span>TRXN-2023-01-10 (Card)</span>
              <span className="text-green-600 font-medium">₹15.80 Paid</span>
            </li>

            <li className="border rounded-lg p-3 flex justify-between">
              <span>TRXN-2023-11-20 (Wallet)</span>
              <span className="text-green-600 font-medium">₹25.00 Paid</span>
            </li>

            <li className="border rounded-lg p-3 flex justify-between">
              <span>TRXN-2023-11-28 (Card)</span>
              <span className="text-green-600 font-medium">₹30.00 Paid</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="flex gap-4 mt-8">
        <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full shadow">
          ✏️ Edit Profile
        </button>

        <button className="flex items-center gap-2 bg-gray-200 px-6 py-2 rounded-full">
          🔒 Reset Password
        </button>

        <button className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-full">
          ❌ Disable Account
        </button>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded"
      onClick={() => logout(navigate)}
    >
      Logout
    </button>
  );
};
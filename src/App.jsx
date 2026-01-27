import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import TripsResults from "./pages/TripsResults";
import Seats from "./pages/Seats";
import CustomerDetails from "./pages/CustomerDetails";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import TicketView from "./pages/TicketView";
import MyTrips from "./pages/MyTrips";
import PassengerDetails from "./pages/PassengerDetails";
import BookingConfirm from "./pages/BookingConfirm";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHome from "./pages/AdminHome";
import AdminBuses from "./pages/AdminBuses";
import AdminTrips from "./pages/AdminTrips";
import AdminBookings from "./pages/AdminBookings";
import AdminTravellers from "./pages/AdminTravellers";
import AdminSearchLogs from "./pages/AdminSearchLogs";

export default function App() {
  return (
    <Routes>
      {/* ===== PUBLIC ===== */}
      <Route path="/" element={<Home />} />

      <Route path="/search" element={<TripsResults />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<Otp />} />

      <Route path="/seats/:tripId" element={<Seats />} />
      <Route path="/booking/:tripId" element={<PassengerDetails />} />
      <Route path="/booking/:tripId/confirm" element={<BookingConfirm />} />

      <Route path="/customers/:bookingId" element={<CustomerDetails />} />
      <Route path="/payment" element={<PaymentDetails />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />

      <Route path="/ticket/:id" element={<TicketView />} />
      <Route path="/my-trips" element={<MyTrips />} />

      {/* ===== ADMIN ===== */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<AdminHome />} />
        <Route path="buses" element={<AdminBuses />} />
        <Route path="trips" element={<AdminTrips />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="travellers" element={<AdminTravellers />} />
        <Route path="search-logs" element={<AdminSearchLogs />} />
      </Route>
    </Routes>
  );
}

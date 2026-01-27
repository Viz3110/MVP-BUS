import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

export default function PassengerDetails() {
  const { busId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const seats = state?.seats || [];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!seats.length) return <p>No seats selected</p>;

  const handleBooking = async () => {
    try {
      await api.post("/api/booking/create", {
        busId,
        seats,
        passengerName: name,
        phone,
      });

      alert("Booking successful");
      navigate("/mytrips");
    } catch (err) {
      alert("Booking failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Passenger Details</h2>

      <p className="mb-3">Seats: {seats.join(", ")}</p>

      <input
        placeholder="Passenger Name"
        className="border p-2 w-full mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Phone Number"
        className="border p-2 w-full mb-4"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={handleBooking}
        className="bg-green-600 text-white px-6 py-2 rounded w-full"
      >
        Confirm Booking
      </button>
    </div>
  );
}

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

export default function BookingConfirm() {
  const navigate = useNavigate();
  const { busId } = useParams();
  const location = useLocation();

  // Ensure seats is ALWAYS a valid array
  const selectedSeats = Array.isArray(location.state?.seats)
    ? location.state.seats
    : [];

  const userId = 1;

  const [passengers, setPassengers] = useState(
    selectedSeats.map(() => ({
      name: "",
      age: "",
      gender: "Male",
    }))
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalFare = selectedSeats.length * 1500;

  const updatePassenger = (i, field, value) => {
    const copy = [...passengers];
    copy[i][field] = value;
    setPassengers(copy);
  };

  const handleConfirmBooking = async () => {
    if (passengers.some(p => !p.name || !p.age)) {
      setError("Please fill all passenger details");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/booking/create", {
        userId,
        tripId: busId,
        seats: selectedSeats,
        passengers,
      });

      navigate(`/ticket/${res.data.booking.id}`);
    } catch (err) {
      console.error(err);
      setError("Booking failed — please try again");
    } finally {
      setLoading(false);
    }
  };

  // === SAFE FALLBACK (prevents white screen) ===
  if (!selectedSeats.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 px-6 text-center">
        <p className="mb-3">
          No seats selected — please go back and choose seats.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 border rounded-full"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3FBF6] p-4 sm:p-8">

      <div className="
        mx-auto bg-white shadow rounded-2xl
        p-4 sm:p-6
        max-w-xl sm:max-w-4xl
      ">

        <h1 className="text-lg sm:text-xl font-semibold text-green-700 mb-3 sm:mb-4">
          Booking Confirmation
        </h1>

        <div className="mb-4 sm:mb-6 text-sm sm:text-base">
          <p>Selected Seats: <strong>{selectedSeats.join(", ")}</strong></p>
          <p className="mt-1">Fare: <strong>₹{totalFare}</strong></p>
        </div>

        <h2 className="font-semibold mb-2 sm:mb-3 text-green-700">
          Passenger Details
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="space-y-3 sm:space-y-4">
          {passengers.map((p, i) => (
            <div
              key={i}
              className="border rounded-xl p-3 sm:p-4
                         flex flex-col sm:flex-row gap-3"
            >
              <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                {i + 1}
              </span>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <input
                  placeholder="Passenger Name"
                  value={p.name}
                  onChange={e => updatePassenger(i, "name", e.target.value)}
                  className="border rounded px-3 py-2 w-full sm:w-1/2 text-sm"
                />

                <input
                  placeholder="Age"
                  value={p.age}
                  onChange={e => updatePassenger(i, "age", e.target.value)}
                  className="border rounded px-3 py-2 w-24 text-sm"
                />

                <select
                  value={p.gender}
                  onChange={e => updatePassenger(i, "gender", e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 border rounded-full"
          >
            Back
          </button>

          <button
            disabled={loading}
            onClick={handleConfirmBooking}
            className="px-6 py-3 bg-green-600 text-white rounded-full disabled:opacity-60"
          >
            {loading ? "Confirming..." : `Confirm & Pay ₹${totalFare}`}
          </button>
        </div>
      </div>
    </div>
  );
}

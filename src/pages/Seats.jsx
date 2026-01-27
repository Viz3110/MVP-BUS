import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useNavigate } from "react-router-dom";


const LOCK_TIME = 5 * 60; // seconds

const DUMMY_SEATS = {
  lower: [
    { id: "L1", status: "booked", price: 1500 },
    { id: "L2", status: "available", price: 1500 },
    { id: "L3", status: "booked", price: 1500 },
    { id: "L4", status: "available", price: 1500 },
    { id: "L5", status: "available", price: 1500 },
    { id: "L6", status: "booked", price: 1500 },
    { id: "L7", status: "booked", price: 1500 },
    { id: "L8", status: "available", price: 1500 },
    { id: "L9", status: "booked", price: 1500 },
    { id: "L10", status: "available", price: 1500 },
    { id: "L11", status: "booked", price: 1500 },
    { id: "L12", status: "booked", price: 1500 },
  ],
  upper: [
    { id: "U1", status: "booked", price: 1500 },
    { id: "U2", status: "available", price: 1500 },
    { id: "U3", status: "booked", price: 1500 },
    { id: "U4", status: "available", price: 1500 },
    { id: "U5", status: "available", price: 1500 },
    { id: "U6", status: "booked", price: 1500 },
    { id: "U7", status: "booked", price: 1500 },
    { id: "U8", status: "available", price: 1500 },
    { id: "U9", status: "booked", price: 1500 },
    { id: "U10", status: "available", price: 1500 },
    { id: "U11", status: "booked", price: 1500 },
    { id: "U12", status: "booked", price: 1500 },
  ],
};

export default function Seats() {
  const { tripId } = useParams();
  const [seats, setSeats] = useState({ lower: [], upper: [] });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const timeLeft = useCountdown(LOCK_TIME);

  useEffect(() => {
    setSeats(DUMMY_SEATS);
  }, []);

  /* DEMO SEAT TOGGLE — NO API */
  const toggleSeat = (seat) => {
    if (seat.status !== "available") return;

    setSelectedSeats((prev) =>
      prev.includes(seat.id)
        ? prev.filter((s) => s !== seat.id)
        : [...prev, seat.id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 p-6">
      {/* HEADER */}
      <div className="bg-indigo-900 text-white rounded-xl px-6 py-4 mb-6 flex justify-between">
        <h2 className="text-lg font-semibold">Select Your Seats</h2>
        <span className="bg-yellow-400 text-black text-xs px-3 py-1 rounded-full">
          ⏱ {timeLeft}s left
        </span>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* LEFT — SEATS */}
        <div className="flex flex-col gap-6 w-[620px]">
          <div className="flex gap-6">
            <div className="bg-white rounded-xl shadow p-4 w-[300px]">
              <h4 className="font-semibold">Lower Deck</h4>
            </div>
            <div className="bg-white rounded-xl shadow p-4 w-[300px]">
              <h4 className="font-semibold">Upper Deck</h4>
            </div>
          </div>

          <div className="flex gap-6">
            <Deck seats={seats.lower} selected={selectedSeats} toggle={toggleSeat} />
            <Deck seats={seats.upper} selected={selectedSeats} toggle={toggleSeat} />
          </div>
        </div>
{/* SEAT LEGEND */}
<div className="flex gap-4 text-xs text-gray-700">
  <div className="flex items-center gap-2">
    <span className="h-4 w-6 bg-white border border-blue-400 rounded" />
    Available
  </div>

  <div className="flex items-center gap-2">
    <span className="h-4 w-6 bg-green-500 rounded" />
    Selected
  </div>

  <div className="flex items-center gap-2">
    <span className="h-4 w-6 bg-gray-300 rounded" />
    Booked
  </div>
</div>
        {/* MIDDLE — BUS DETAILS */}
        <BusDetails selectedSeats={selectedSeats} />

        {/* RIGHT — SUMMARY */}
        <Summary selectedSeats={selectedSeats} timeLeft={timeLeft} />
      </div>
    </div>
  );
}

/* ================= SEAT DECK ================= */
function Deck({ seats, selected, toggle }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-[300px]">

      {/* DRIVER INDICATOR */}
      <div className="flex justify-end mb-3">
        <div className="text-[10px] bg-gray-200 px-2 py-1 rounded">
          Driver
        </div>
      </div>

      {/* SEAT GRID */}
      <div className="grid grid-cols-3 gap-y-3 gap-x-2">
        {seats.map((seat, index) => {
          const isSelected = selected.includes(seat.id);

          return (
            <button
              key={seat.id}
              onClick={() => toggle(seat)}
              disabled={seat.status !== "available"}
              className={`
                h-10 w-14 rounded-md text-[9px] font-semibold
                flex items-center justify-center
                transition-all duration-200 ease-in-out
                ${index % 3 === 1 ? "mr-6" : ""}   /* aisle gap */

                ${
                  seat.status === "booked"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isSelected
                    ? "bg-green-500 text-white scale-105 shadow-md"
                    : "bg-gray-100 border border-gray-400 text-gray-700 hover:bg-green-100 hover:scale-105 hover:shadow"
                }
              `}
            >
              {seat.id}
            </button>
          );
        })}
      </div>
    </div>
  );
}
/* ================= BUS DETAILS ================= */
function BusDetails({ selectedSeats }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 w-[380px]">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-bold">VJ Holidays</h3>
          <p className="text-sm text-gray-600">Sleeper • AC • Night Service</p>
          <p className="text-sm text-green-600 mt-1">
            Bharat Benz A/C Sleeper (2+1)
          </p>
          <p className="text-sm mt-2">23:00 → 05:50</p>
        </div>
        <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
          ★ 4.9
        </span>
      </div>

      <div className="flex gap-3 mt-4">
        <div className="h-20 w-28 bg-gray-200 rounded" />
        <div className="h-20 w-28 bg-gray-200 rounded" />
        <div className="h-20 w-28 bg-gray-200 rounded" />
      </div>

      <div className="mt-6">
        <p className="text-sm">
          Selected Seats: <strong>{selectedSeats.join(", ") || "None"}</strong>
        </p>
        <p className="text-lg font-bold mt-2">
          Total: ₹{selectedSeats.length * 1500}
        </p>
      </div>
    </div>
  );
}

/* ================= SUMMARY ================= */
function Summary({ selectedSeats, timeLeft }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow p-6 w-[300px]">
      <p className="text-sm">
        Selected Seats: <strong>{selectedSeats.join(", ") || "None"}</strong>
      </p>

      <p className="text-lg font-bold mt-2">
        Total: ₹{selectedSeats.length * 1500}
      </p>

      <button
        disabled={!selectedSeats.length || timeLeft <= 0}
        onClick={() =>
          navigate("/payment", {
            state: {
              seats: selectedSeats,
              amount: selectedSeats.length * 1500
            }
          })
        }
        className={`mt-4 w-full py-3 rounded-lg text-white ${
          selectedSeats.length && timeLeft > 0
            ? "bg-indigo-900 hover:bg-indigo-800"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Continue to Payment
      </button>
    </div>
  );
}
/* ================= COUNTDOWN ================= */
function useCountdown(seconds) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  return timeLeft;
}

import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function TicketView() {
  const { id } = useParams(); // booking id from URL
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid ticket URL");
      return;
    }

    const fetchTicket = async () => {
      try {
        const res = await api.get(`/api/booking/${id}`);
        const b = res.data.booking;

        setTicket({
          tripId: b.id,
          route: `${b.bus.from} → ${b.bus.to}`,
          date: new Date(b.createdAt).toLocaleDateString(),
          departure: b.trip?.startTime || "N/A",
          passengerName: b.passengers?.[0]?.name || "Passenger",
          seatNumbers: b.seats,
          passengers: b.seats.length,
          amount: `₹${b.price}`,
          status: b.paymentStatus,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load ticket");
      }
    };

    fetchTicket();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading ticket...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3FBF6] flex">
      {/* SIDEBAR */}
      <aside className="w-60 bg-white shadow-lg p-6">
        <h2 className="font-bold text-lg mb-6 text-green-700">
          YOUR E-TICKET
        </h2>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10">
        <div className="bg-green-800 text-white py-4 px-6 rounded-xl mb-8">
          <h1 className="text-xl font-semibold">YOUR E-TICKET</h1>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex gap-8 items-center mb-8">
          <div className="p-4 border-2 border-green-500 rounded-xl">
            <QRCode value={String(ticket.tripId)} size={140} />
            <p className="text-xs text-center mt-2 text-gray-500">
              SCAN TO BOARD
            </p>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">
              Booking ID: <span className="font-medium">{ticket.tripId}</span>
            </p>

            <h2 className="text-xl font-semibold text-green-700 mb-2">
              {ticket.route}
            </h2>

            <p className="text-sm text-gray-600">Date: {ticket.date}</p>
            <p className="text-sm text-gray-600">
              Departure: {ticket.departure}
            </p>
          </div>

          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            {ticket.status}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 className="font-semibold mb-4 text-green-700">
            Passenger Details
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <p>
              <span className="text-gray-500">Passenger Name:</span>{" "}
              {ticket.passengerName}
            </p>

            <p>
              <span className="text-gray-500">Passengers:</span>{" "}
              {ticket.passengers}
            </p>

            <p>
              <span className="text-gray-500">Seat Numbers:</span>{" "}
              {ticket.seatNumbers.join(", ")}
            </p>

            <p>
              <span className="text-gray-500">Amount Paid:</span>{" "}
              {ticket.amount}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
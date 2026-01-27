import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentDetails() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("card");

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="bg-green-700 text-white text-center py-4 text-lg font-semibold">
          PAYMENT DETAILS
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ================= LEFT PAYMENT METHODS ================= */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">
              SELECT PAYMENT METHOD
            </h3>

            {[
              { id: "card", label: "Credit / Debit Card" },
              { id: "paypal", label: "PayPal" },
              { id: "wallet", label: "Digital Wallet" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition ${
                  method === m.id
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className="w-3 h-3 rounded-full border flex items-center justify-center">
                  {method === m.id && (
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                  )}
                </span>
                {m.label}
              </button>
            ))}
          </div>

          {/* ================= PAYMENT FORM ================= */}
          <div className="md:col-span-1 border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              CARD DETAILS
            </h3>

            <div className="space-y-3">
              <input
                placeholder="Cardholder Name"
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />
              <input
                placeholder="Card Number"
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />
              <div className="flex gap-3">
                <input
                  placeholder="MM / YY"
                  className="w-1/2 border rounded-lg px-4 py-2 text-sm"
                />
                <input
                  placeholder="CVV"
                  className="w-1/2 border rounded-lg px-4 py-2 text-sm"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                <input type="checkbox" />
                Save this card for future trips
              </label>
            </div>
          </div>

          {/* ================= ORDER SUMMARY ================= */}
          <div className="border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              ORDER SUMMARY
            </h3>

            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Trip</span>
                <span>Downtown Express</span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span>20 Nov 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Passengers</span>
                <span>2</span>
              </div>
              <div className="flex justify-between">
                <span>Base Fare</span>
                <span>₹180.00</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>₹40.80</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span className="text-green-600">₹220.80</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/payment-success")}
              className="w-full bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition"
            >
              PAY NOW
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

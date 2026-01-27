import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-[520px] rounded-2xl shadow-xl overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="bg-green-700 text-white text-center py-4 font-semibold tracking-wide">
          PAYMENT SUCCESS
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-8 text-center">

          {/* CHECK ICON */}
          <div className="w-20 h-20 mx-auto rounded-full bg-green-600 flex items-center justify-center text-white text-4xl mb-4">
            ✓
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Your Payment Was <span className="text-green-600">Successful!</span>
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Your booking is confirmed. Enjoy your trip!
          </p>

          {/* ================= TRANSACTION SUMMARY ================= */}
          <div className="border border-green-300 rounded-xl text-left p-5 mb-6">

            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              TRANSACTION SUMMARY
            </h3>

            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <span className="font-medium">Transaction ID:</span>{" "}
                #MBTS-2023-015-001
              </p>

              <p>
                <span className="font-medium">Trip:</span> Downtown Express
              </p>

              <p>
                <span className="font-medium">Route:</span> Pickup at 12:00 PM
              </p>

              <p>
                <span className="font-medium">Passengers:</span> 2
              </p>

              <p>
                <span className="font-medium">Amount Paid:</span>{" "}
                <span className="text-green-600 font-semibold">₹220.00</span>
              </p>

              <p>
                <span className="font-medium">Payment Method:</span> Visa **** 1234
              </p>
            </div>

            <button className="mt-4 w-full border border-green-600 text-green-700 py-2 rounded-lg font-medium hover:bg-green-50 transition">
              VIEW E-TICKET
            </button>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 border border-gray-300 px-5 py-2 rounded-full text-sm hover:bg-gray-100 transition"
            >
              ← Back to Dashboard
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full text-sm hover:bg-green-700 transition"
            >
              🖨 Print Receipt
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

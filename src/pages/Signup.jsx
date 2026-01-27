import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import illustration from "../assets/Frame 11.png";
import googleLogo from "../assets/image 4.png";
import indiaFlag from "../assets/image 5.png";
import loadingLogo from "../assets/geobus 2.png";
import bgvdo from "../assets/bgvdo.mp4"; // ✅ VIDEO USED ONLY FOR LOADING

export default function Signup() {
  const navigate = useNavigate();

  const [showSignup, setShowSignup] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSignup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] relative overflow-hidden">

      {/* ✅ VIDEO ONLY DURING LOADING */}
      {!showSignup && (
        <>
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover z-[1]"
          >
            <source src={bgvdo} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-white/40 z-10 pointer-events-none"></div>

          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="relative">
              <img
                src={loadingLogo}
                alt="Loading"
                className="w-20 drop-shadow-[0_0_18px_rgba(255,255,255,0.9)] animate-pulse"
              />
            </div>
          </div>
        </>
      )}

      {/* ================= DESKTOP VIEW ================= */}
      {showSignup && (
        <div className="hidden md:flex w-full min-h-screen relative z-10 animate-fadeIn">

          {/* ✅ LEFT ILLUSTRATION */}
          <div className="w-[70%] h-screen">
            <img
              src={illustration}
              alt="GeoBus Illustration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* ✅ RIGHT FORM */}
          <div className="w-[80%] flex items-center justify-center">

            <div className="w-full max-w-[550px] bg-white/35 backdrop-blur-2xl border border-white/30 shadow-xl rounded-xl px-8 py-7">

              <h1 className="text-center text-2xl font-bold text-[#1F2A5C] mb-1">
                GE🌍BUS
              </h1>

              <h2 className="text-center text-lg font-semibold mb-1">
                Create Account
              </h2>

              <p className="text-center text-gray-500 mb-4 text-sm">
                Start Your Smart Travel Journey
              </p>

              {error && (
                <p className="text-red-500 text-xs text-center mb-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 mb-3">
                <input
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className="w-1/2 border rounded-full px-4 py-2 text-sm outline-none"
                />
                <input
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className="w-1/2 border rounded-full px-4 py-2 text-sm outline-none"
                />
              </div>

              <input
                placeholder="Email (optional)"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border rounded-full px-4 py-2 text-sm outline-none mb-3"
              />

              <div className="flex items-center border rounded-full overflow-hidden mb-4">
                <div className="flex items-center gap-2 px-3">
                  <img src={indiaFlag} className="w-5 h-4" />
                  <span className="text-sm">+91</span>
                </div>
                <input
                  placeholder="Enter Mobile Number"
                  value={form.mobile}
                  onChange={(e) =>
                    setForm({ ...form, mobile: e.target.value })
                  }
                  className="w-full px-2 py-2 text-sm outline-none"
                />
              </div>

              <button
                onClick={() => {
                  if (
                    !form.firstName ||
                    !form.lastName ||
                    !/^[6-9]\d{9}$/.test(form.mobile)
                  ) {
                    setError("Please fill all required fields correctly");
                    return;
                  }

                  if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
                    setError("Invalid email format");
                    return;
                  }

                  setError("");
                  alert("Account Created ✅");
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full mb-4"
              >
                Create Account
              </button>

              <div className="flex items-center mb-4">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="px-3 text-sm text-gray-500">
                  Or continue with
                </span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>

              <button className="w-full border py-3 rounded-full flex items-center justify-center gap-3 mb-4">
                <img src={googleLogo} className="w-6 h-6" />
                <span className="text-sm font-medium">
                  Sign in with Google
                </span>
              </button>

              <p className="text-center text-sm">
                Have an account?{" "}
                <span
                  onClick={() => navigate("/")}
                  className="text-green-600 font-semibold cursor-pointer"
                >
                  Sign in
                </span>
              </p>

            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE VIEW ================= */}
      {showSignup && (
        <div className="md:hidden min-h-screen relative z-10 flex flex-col bg-[#F7F7F7]">

          {/* ✅ BLURRED ILLUSTRATION 60% */}
          <div className="w-full h-[60vh] overflow-hidden blur-sm">
            <img
              src={illustration}
              className="w-full h-full object-cover"
            />
          </div>

          {/* ✅ OVERLAPPED SIGNUP CARD */}
          <div className="absolute bottom-0 w-full px-4 pb-8 animate-overlap-entry">
            <div className="w-full max-w-[360px] mx-auto bg-white/40 backdrop-blur-2xl rounded-[28px] px-6 py-7 shadow-xl">

              <h2 className="text-center text-xl font-semibold mb-1">
                Create Account
              </h2>
              <p className="text-center text-gray-500 mb-4 text-sm">
                Start Your Smart Travel Journey
              </p>

              {error && (
                <p className="text-red-500 text-xs text-center mb-2">
                  {error}
                </p>
              )}

              <div className="flex gap-2 mb-3">
                <input
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className="w-1/2 border rounded-full px-3 py-2 text-sm"
                />
                <input
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className="w-1/2 border rounded-full px-3 py-2 text-sm"
                />
              </div>

              <input
                placeholder="Email (optional)"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border rounded-full px-3 py-2 text-sm mb-3"
              />

              <div className="flex items-center border rounded-full mb-4">
                <div className="flex items-center gap-2 px-3">
                  <img src={indiaFlag} className="w-5 h-4" />
                  <span className="text-sm">+91</span>
                </div>
                <input
                  placeholder="Mobile Number"
                  value={form.mobile}
                  onChange={(e) =>
                    setForm({ ...form, mobile: e.target.value })
                  }
                  className="w-full px-2 py-2 text-sm"
                />
              </div>

              <button
                onClick={() => {
                  if (!/^[6-9]\d{9}$/.test(form.mobile)) {
                    setError("Enter valid mobile number");
                    return;
                  }
                  setError("");
                  alert("Account Created ✅");
                }}
                className="w-full bg-green-600 text-white py-3 rounded-full mb-4"
              >
                Create Account
              </button>

              <div className="flex items-center mb-4">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="px-3 text-xs text-gray-500">
                  Or continue with
                </span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>

              <button className="w-full border py-3 rounded-full flex items-center justify-center gap-3 mb-4">
                <img src={googleLogo} className="w-5 h-5" />
                <span className="text-sm">Sign in with Google</span>
              </button>

              <p className="text-center text-sm">
                Have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-green-600 font-semibold"
                >
                  Sign in
                </span>
              </p>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}


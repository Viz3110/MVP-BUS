import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import illustration from "../assets/Frame 11.png";
import logo from "../assets/geobus 2.png"; 
import googleLogo from "../assets/image 4.png";
import indiaFlag from "../assets/image 5.png";
import recaptcha from "../assets/recaptcha.png";

export default function Login() {
  const navigate = useNavigate();
  const tiltRef = useRef(null);
  const inputsRef = useRef([]);

  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const [seconds, setSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [shake, setShake] = useState(false);

  // ================= TIMER =================
  useEffect(() => {
    if (seconds === 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  // ================= PARALLAX =================
  useEffect(() => {
    const handleScroll = () => {
      const illus = document.querySelector(".parallax-illus");
      if (illus) {
        illus.style.transform = `translateY(${window.scrollY * 0.08}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ================= TILT =================
  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y - rect.height / 2) / rect.height) * -8;
      const rotateY = ((x - rect.width / 2) / rect.width) * 8;

      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const reset = () => {
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", reset);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);

  // ================= VERIFY OTP =================
  const handleVerify = async () => {
    const enteredOtp = inputsRef.current.map(i => i?.value || "").join("");

    if (enteredOtp.length !== 6) {
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }

    try {
      const phone = localStorage.getItem("login_phone");

      const res = await api.post("/auth/verify-otp", {
        phone,
        otp: String(enteredOtp)  // 🔹 always send as string
      });

      console.log("VERIFY RESPONSE 👉", res.data); // 🔹 debug log

      if (!res.data.success) throw new Error("Invalid OTP");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("OTP Verified & Logged In ✅");
      navigate("/");

    } catch (err) {
      console.error("VERIFY OTP ERROR 👉", err?.response?.data || err.message);

      setShake(true);
      setTimeout(() => setShake(false), 450);

      inputsRef.current.forEach((i) => i && (i.value = ""));
      inputsRef.current[0]?.focus();
    }
  };

  // ================= RESEND OTP =================
  const handleResend = async () => {
    const phone = localStorage.getItem("login_phone");
    if (!phone) return alert("Phone number missing");

    try {
      await api.post("/auth/send-otp", { phone });
      alert("OTP Resent ✅");
      setSeconds(30);
      setCanResend(false);
    } catch (err) {
      console.error("RESEND OTP ERROR 👉", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to resend OTP");
    }
  };

  // Autofocus first OTP input
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7]">

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex w-full min-h-screen">

        <div className="w-[70%] h-screen overflow-hidden">
          <img
            ref={tiltRef}
            src={illustration}
            alt="GeoBus Illustration"
            className="w-full h-full object-cover parallax-illus"
          />
        </div>

        <div className="w-[80%] flex items-center justify-center relative">

          <div className="w-full flex items-center justify-center">
            <div className={`w-full max-w-[520px] rounded-2xl p-10 bg-white shadow-2xl border ${shake ? "animate-shake" : ""}`}>

              <h1 className="text-center text-4xl font-bold text-[#1F2A5C] mb-4">
                GE<span className="text-blue-500">🌍</span>BUS
              </h1>

              <h2 className="text-center text-2xl font-semibold mb-2 text-[#1F2A5C]">
                Verification Code
              </h2>

              <p className="text-center text-gray-500 text-sm mb-2">
                Please enter the 6-digit code sent on
              </p>

              <p className="text-center text-lg font-semibold text-[#1F2A5C] mb-6">
                {localStorage.getItem("login_phone") || "+91 XXXXX XXXXX"} ✏️
              </p>

              <div className="flex justify-between gap-3 mb-6">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    maxLength={1}
                    onChange={(e) => {
                      if (e.target.value && inputsRef.current[i + 1]) {
                        inputsRef.current[i + 1].focus();
                      }
                    }}
                    className="w-14 h-14 rounded-xl border-2 border-blue-300 text-xl text-center outline-none focus:border-green-500"
                  />
                ))}
              </div>

              <p
                onClick={handleResend}
                className={`text-center text-sm mb-8 ${
                  canResend ? "text-blue-600 cursor-pointer" : "text-gray-400"
                }`}
              >
                {canResend ? "Resend OTP" : `Resend in ${seconds}s`}
              </p>

              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-full text-lg font-semibold"
                onClick={handleVerify}
              >
                VERIFY
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden relative min-h-screen bg-[#F7F7F7] overflow-hidden">

        <div className="absolute top-0 w-full h-[60vh] overflow-hidden">
          <img src={illustration} className="w-full h-full object-cover blur-md scale-110" />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 flex justify-center items-end min-h-screen px-4 pb-10">

          <div className="w-full max-w-[340px] rounded-[26px] px-6 py-7 bg-white/60 backdrop-blur-xl border shadow-xl">

            <img src={logo} className="w-24 mx-auto mb-3" />

            <div className="w-full mb-4">
              <div className="flex items-center gap-2 border-2 border-blue-400 rounded-full px-4 py-2.5">
                <img src={indiaFlag} className="w-6 h-4" />
                <span className="text-gray-700 text-sm font-medium">+91</span>

                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter Mobile Number"
                  className="w-full outline-none text-sm bg-transparent"
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
            </div>

            <button
              type="button"
              onClick={async () => {
                if (!/^[6-9]\d{9}$/.test(mobile)) {
                  setError("Enter a valid 10-digit mobile number");
                  return;
                }

                setError("");

                const phone = `+91${mobile}`;
                localStorage.setItem("login_phone", phone);

                try {
                  await api.post("/auth/send-otp", { phone });
                  navigate("/otp");
                } catch (err) {
                  console.error("RESEND OTP ERROR 👉", err?.response?.data || err.message);
                  alert(err?.response?.data?.message || "Failed to resend OTP");
                }
              }}
              className="w-full bg-green-600 text-white py-3 rounded-full mb-4"
            >
              REQUEST OTP
            </button>

            <button className="w-full border py-3 rounded-full flex items-center justify-center gap-3 bg-white">
              <img src={googleLogo} className="w-6 h-6" />
              <span className="text-sm font-medium">Sign in with Google</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

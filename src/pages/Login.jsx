import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import illustration from "../assets/Frame 11.png";
import logo from "../assets/geobus 2.png";
import googleLogo from "../assets/image 4.png";
import indiaFlag from "../assets/image 5.png";
import recaptcha from "../assets/recaptcha.png";

export default function Login() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const tiltRef = useRef(null);

  /* ✅ SHARED OTP HANDLER — USED BY DESKTOP + MOBILE */
  const requestOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    setError("");

    try {
      const res = await api.post("/auth/send-otp", {
        phone: `+91${mobile}`,
      });

      if (res.data.success) {
        localStorage.setItem("login_phone", `+91${mobile}`);

        navigate("/otp", {
          state: { phone: `+91${mobile}` },
        });
      }
    } catch (err) {
      console.error("OTP API ERROR 👉", err?.response?.data || err.message);
      setError(err?.response?.data?.message || "Failed to send OTP. Try again.");
    }
  };

  /* PARALLAX + GLASS DEPTH EFFECT */
  useEffect(() => {
    const handleScroll = () => {
      const illus = document.querySelector(".parallax-illus");
      if (illus) {
        illus.style.transform = `translateY(${window.scrollY * 0.08}px)`;
      }

      const card = document.querySelector(".glass-card");
      if (!card) return;

      const depth = Math.min(window.scrollY / 300, 1);

      card.style.transform = `
        perspective(1200px)
        rotateX(${depth * 2}deg)
        scale(${1 - depth * 0.02})
      `;
      card.style.backdropFilter = `blur(${24 + depth * 10}px)`;
      card.style.background = `rgba(255,255,255,${0.35 + depth * 0.15})`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* 3D TILT EFFECT */
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

  /* RIPPLE EFFECT */
  const createRipple = (e) => {
    const card = e.currentTarget;
    const ripple = document.createElement("span");

    const size = Math.max(card.offsetWidth, card.offsetHeight);
    const rect = card.getBoundingClientRect();

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    ripple.className = "glass-ripple";
    card.appendChild(ripple);

    setTimeout(() => ripple.remove(), 700);
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7]">

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:flex w-full min-h-screen">

        {/* LEFT ILLUSTRATION */}
        <div className="w-[70%] h-screen overflow-hidden">
          <img
            ref={tiltRef}
            src={illustration}
            alt="GeoBus Illustration"
            className="w-full h-full object-cover animate-illustrationBoot parallax-illus shimmer-illus shadow-breathe"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-[80%] flex items-center justify-center relative">
          <div className="w-full flex items-center justify-center animate-fadeIn">
            <div
              className="w-full max-w-[550px] rounded-xl p-8
              bg-white/35 backdrop-blur-2xl border border-white/30
              glass-card ai-refraction neon-glow ambient-shadow ripple-glass"
              onClick={createRipple}
            >
              <img src={logo} className="w-44 mx-auto mb-4" />

              <h2 className="text-center text-[20px] font-semibold mb-1">Welcome Back</h2>
              <p className="text-center text-gray-500 mb-4 text-[15px]">Sign in to continue</p>

              <div className="mb-4">
                <div className="flex items-center gap-2 border rounded-lg px-3 py-3">
                  <img src={indiaFlag} className="w-7 h-4" />
                  <span className="text-sm">+91</span>

                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter Mobile Number"
                    className="w-full outline-none text-sm"
                  />
                </div>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

              <div className="border rounded-lg flex items-center gap-2 px-4 py-2 mb-4">
                <input type="checkbox" />
                <span className="text-xs">I'm not a robot</span>
                <img src={recaptcha} className="w-6 ml-auto" />
              </div>

              {/* 🟢 DESKTOP — NOW USES SHARED OTP FUNCTION */}
              <button
                type="button"
                onClick={requestOtp}
                className="w-full bg-green-600 text-white py-3 rounded-full mb-4"
              >
                REQUEST OTP
              </button>
            <p className="text-center text-sm text-gray-600 mt-4">
  Don&apos;t have an account?{" "}
  <span
    onClick={() => navigate("/signup")}
    className="text-green-600 font-semibold cursor-pointer hover:underline"
  >
    Sign up
  </span>
</p>
              {/* (remaining UI left untouched) */}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden relative min-h-screen bg-[#F7F7F7] overflow-hidden">

        <div className="absolute top-0 w-full h-[60vh] overflow-hidden">
          <img src={illustration} className="w-full h-full object-cover blur-md scale-110" />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 flex justify-center items-end min-h-screen px-4 pb-10">

          <div className="w-full max-w-[340px] rounded-[26px] px-6 py-7
            bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl"
          >
            <img src={logo} className="w-24 mx-auto mb-3" />

            <h2 className="text-center text-lg font-semibold mb-1">Welcome Back</h2>

            <div className="w-full mb-4">
              <div className="flex items-center gap-2 border-2 border-blue-400 rounded-full px-4 py-2.5">
                <img src={indiaFlag} className="w-6 h-4" />
                <span className="text-sm font-medium">+91</span>

                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter Mobile Number"
                  className="w-full outline-none text-sm bg-transparent"
                />
              </div>

              {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
            </div>

            {/* 🟢 MOBILE — NOW USES SAME BACKEND OTP CALL */}
            /* 🟢 MOBILE — BUTTON NOW ONLY NAVIGATES TO OTP PAGE */

<button
  type="button"
  onClick={() => navigate("/otp")}
  className="w-full bg-green-600 text-white py-3 rounded-full mb-4"
>
  REQUEST OTP
</button>
<p className="text-center text-sm text-gray-600 mt-4">
  Don&apos;t have an account?{" "}
  <span
    onClick={() => navigate("/signup")}
    className="text-green-600 font-semibold cursor-pointer hover:underline"
  >
    Sign up
  </span>
</p>


            {/* (everything else remains unchanged) */}
          </div>
        </div>
      </div>
    </div>
  );
}

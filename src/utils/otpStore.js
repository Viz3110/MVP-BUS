// src/utils/otpStore.js

const otpStore = new Map();

const normalize = p =>
  p.replace(/\s+/g, "").replace(/^(\+91)?/, "+91");

export const saveOtp = (phone, otp) => {
  phone = normalize(phone);

  otpStore.set(phone, {
    otp: String(otp),
    expires: Date.now() + 5 * 60 * 1000 // 5 min
  });

  console.log("OTP SAVED 👉", phone, otp);
  console.log("OTP STORE KEYS 👉", [...otpStore.keys()]);
};

export const verifyOtp = (phone, otp) => {
  phone = normalize(phone);

  const data = otpStore.get(phone);

  console.log("VERIFY CHECK 👉", { phone, entered: otp, stored: data });

  if (!data) return false;

  const ok =
    data.otp === String(otp) &&
    Date.now() < data.expires;

  if (ok) otpStore.delete(phone); // consume OTP

  return ok;
};

// ♻️ Auto-cleanup every 2 min
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (now > data.expires) otpStore.delete(phone);
  }
}, 2 * 60 * 1000);

export default otpStore;

const otpStore = new Map();

// Save OTP for 2 minutes
export function saveOtp(phone, otp) {
  otpStore.set(phone, { otp, expires: Date.now() + 2 * 60 * 1000 });
}

export function verifyOtp(phone, otp) {
  const entry = otpStore.get(phone);
  if (!entry) return false;

  if (Date.now() > entry.expires) {
    otpStore.delete(phone);
    return false;
  }

  return entry.otp === otp;
}

export default otpStore;

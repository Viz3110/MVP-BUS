const rateStore = new Map();

export const trackOtpRequest = (phone) => {
  const now = Date.now();
  let entry = rateStore.get(phone) || { attempts: 0, blockedUntil: 0 };

  if (entry.blockedUntil && now < entry.blockedUntil) {
    return { blocked: true, wait: entry.blockedUntil - now };
  }

  entry.attempts++;

  // 3 attempts in 5 min → block for 10 min
  if (entry.attempts > 3) {
    entry.blockedUntil = now + 10 * 60 * 1000;
    entry.attempts = 0;
  }

  rateStore.set(phone, entry);

  return { blocked: false };
};

export const resetOtpAttempts = (phone) => {
  rateStore.delete(phone);
};

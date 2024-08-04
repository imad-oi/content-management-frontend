
export const setCaptchaVerified = () => {
  sessionStorage.setItem("captchaVerified", "true");
};

export const isCaptchaVerified = () => {
  return sessionStorage.getItem("captchaVerified") === "true";
};

export const clearCaptchaVerification = () => {
  sessionStorage.removeItem("captchaVerified");
};
export const logout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("login_phone");
  navigate("/");
};

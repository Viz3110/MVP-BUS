import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050/api", // your backend base URL
  withCredentials: true,
});

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // change if your backend runs on different port
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

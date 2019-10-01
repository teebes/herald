import axios from "axios";
import store from "@/store";

const API_BASE = "http://localhost:8000/api/v1";

export const BuilderAPI = axios.create({
  baseURL: `${API_BASE}/builder`,
  headers: function() {
    return { Authorization: `JWT nothing` };
  }
});

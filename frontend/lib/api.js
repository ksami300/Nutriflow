import axios from "axios";
import { getToken } from "@/utils/auth";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const testAPI = async () => {
  const res = await API.get("/api/test");
  return res.data;
};
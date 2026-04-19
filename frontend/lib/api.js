import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const testAPI = async () => {
  const res = await API.get("/api/test");
  return res.data;
};
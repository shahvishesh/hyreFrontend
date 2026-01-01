import axiosInstance from "./axiosInstance";

export const login = (data) => {
  return axiosInstance.post("/api/Auth/login", data);
};

export const register = (data) => {
  return axiosInstance.post("/api/Auth/register", data);
};

// api/adminRoles.api.js
import axiosInstance from "./axiosInstance";

export const getUsersWithRoles = () => {
  return axiosInstance.get("/api/AdminRoles/users");
};

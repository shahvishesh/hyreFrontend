import axiosInstance from "./axiosInstance";

export const getAdminUsers = () => {
  return axiosInstance.get("/api/AdminRoles/users");
};

export const assignRoles = (payload) => {
  return axiosInstance.post("/api/AdminRoles/assign-roles", payload);
};

export const removeRoles = (payload) => {
  return axiosInstance.post("/api/AdminRoles/remove-roles", payload);
};

export const getAllRoles = () => {
  return axiosInstance.get("/api/AdminRoles/roles");
};

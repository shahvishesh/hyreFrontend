import axiosInstance from "./axiosInstance";

export const getSkills = () => {
  return axiosInstance.get("/api/Skills");
};

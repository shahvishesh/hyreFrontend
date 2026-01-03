import axiosInstance from "./axiosInstance";

export const getInterviewsByTab = (tab) => {
  return axiosInstance.get(`/api/Interview/${tab}`);
};

import axiosInstance from "./axiosInstance";

export const createJob = (data) => {
  return axiosInstance.post("/api/Jobs", data);
};


export const getJobs = () => {
  return axiosInstance.get("/api/Jobs");
};

export const getJobById = (jobId) => {
  return axiosInstance.get(`/api/Jobs/${jobId}`);
};

export const updateJob = (jobId, data) => {
  return axiosInstance.put(`/api/Jobs/${jobId}`, data);
};

export const deleteJob = (jobId) => {
  return axiosInstance.delete(`/api/Jobs/${jobId}`);
};

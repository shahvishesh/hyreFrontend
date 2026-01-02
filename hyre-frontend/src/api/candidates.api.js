import axiosInstance from "./axiosInstance";

export const createCandidate = (formData) => {
  return axiosInstance.post(
    "/api/Candidate/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

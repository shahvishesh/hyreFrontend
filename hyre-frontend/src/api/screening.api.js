import axiosInstance from "./axiosInstance";

export const getScreeningCandidates = (jobId) => {
  return axiosInstance.get(
    `/api/CandidateJob/${jobId}/candidates`
  );
};

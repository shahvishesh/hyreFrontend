import axiosInstance from "./axiosInstance";

export const getCandidateMatches = (jobId) => {
  return axiosInstance.get(
    `/api/CandidateMatching/${jobId}/candidates/match`
  );
};

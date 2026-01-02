import axiosInstance from "./axiosInstance";

export const linkCandidateToJob = (jobId, candidateID) => {
  return axiosInstance.post(
    `/api/CandidateJob/${jobId}/link`,
    { candidateID }
  );
};

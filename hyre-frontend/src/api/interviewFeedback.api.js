import axiosInstance from "./axiosInstance";

export const submitInterviewFeedback = (payload) => {
  return axiosInstance.post(
    "/api/InterviewFeedback",
    payload
  );
};

export const getInterviewFeedback = (candidateRoundId) => {
  return axiosInstance.get(
    `/api/InterviewFeedback/round/${candidateRoundId}/my-feedback`
  );
}

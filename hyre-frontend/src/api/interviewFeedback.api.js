import axiosInstance from "./axiosInstance";

export const submitInterviewFeedback = (payload) => {
  return axiosInstance.post(
    "/api/InterviewFeedback",
    payload
  );
};

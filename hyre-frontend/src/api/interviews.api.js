import axiosInstance from "./axiosInstance";

export const getInterviewsByTab = (tab) => {
  return axiosInstance.get(`/api/Interview/${tab}`);
};


export const getLiveInterviewDetails = () => {
  return axiosInstance.get("/api/Interview/live/details");
}

export const getRoundDetail = (candidateRoundId) => {
  return axiosInstance.get(`/api/InterviewFeedback/round-detail/${candidateRoundId}`);
}
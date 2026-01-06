import axiosInstance from "./axiosInstance";

export const getPendingReviewerJobs = () =>
  axiosInstance.get("/api/JobReviewer/jobs?status=pending");

export const getAssignedReviewerJobs = () =>
  axiosInstance.get("/api/JobReviewer/jobs?status=completed");

export const assignReviewers = (payload) =>
  axiosInstance.post("/api/JobReviewer/assign", payload);

export const getAssignedReviewerJobsByJobId = (jobId) =>
  axiosInstance.get(`/api/JobReviewer/${jobId}`);

export const getAllReviewers = () =>
  axiosInstance.get("/api/JobReviewer/reviewers");
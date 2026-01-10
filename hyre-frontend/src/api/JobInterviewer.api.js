import axiosInstance from "./axiosInstance";

export const getPendingInterviewerJobs = () =>
  axiosInstance.get("/api/JobInterviewer/jobs?status=pending");

export const getAssignedInterviewerJobs = () =>
  axiosInstance.get("/api/JobInterviewer/jobs?status=completed");


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

export const uploadCandidatesExcel = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosInstance.post(
    "/api/Candidate/upload-excel",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

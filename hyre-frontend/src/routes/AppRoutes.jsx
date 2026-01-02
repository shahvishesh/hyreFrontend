import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
//import CandidateList from "../pages/candidates/CandidateList";
import { Navigate } from "react-router-dom";
import CreateJob from "../pages/jobs/CreateJob";
import JobsLayout from "../pages/jobs/JobsLayout";
import JobsHome from "../pages/jobs/JobsHome";
import EditJob from "../pages/jobs/EditJob";
import JobDetails from "../pages/jobs/JobDetails"; 
import JobsList from "../pages/jobs/JobsList";
import CandidatesLayout from "../pages/candidates/CandidatesLayout";
import CandidatesHome from "../pages/candidates/CandidatesHome";
import CreateCandidate from "../pages/candidates/CreateCandidate";
/* import CandidatesList from "../pages/candidates/CandidatesList";
import CandidateDetails from "../pages/candidates/CandidateDetails"; */
import UploadCandidatesExcel from "../pages/candidates/UploadCandidatesExcel";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard/jobs" element={<JobsLayout />}>
            <Route index element={<JobsHome />} />
            <Route path="list" element={<JobsList />} />
            <Route path="create" element={<CreateJob />} />
            <Route path=":jobId" element={<JobDetails />} />
            <Route path="edit/:jobId" element={<EditJob />} />
          </Route>

          <Route path="/dashboard/candidates" element={<CandidatesLayout />}>
            <Route index element={<CandidatesHome />} />
            <Route path="create" element={<CreateCandidate />} />
            <Route
              path="/dashboard/candidates/upload-excel"
              element={<UploadCandidatesExcel />}
            />

            {/* <Route path="list" element={<CandidatesList />} />
            <Route path=":candidateId" element={<CandidateDetails />} /> */}
          </Route>

        </Route>
      </Route>
    </Routes>
  );
}

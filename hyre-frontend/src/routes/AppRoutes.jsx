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

import UploadCandidatesExcel from "../pages/candidates/UploadCandidatesExcel";
import CandidatesList from "../pages/candidates/CandidatesList";
import CandidateDetails from "../pages/candidates/CandidateDetails";

import ScreeningLayout from "../pages/screening/ScreeningLayout";
import ScreeningHome from "../pages/screening/ScreeningHome";
import ScreeningJobsList from "../pages/screening/ScreeningJobsList";
import JobScreeningCandidates from "../pages/screening/JobScreeningCandidates";
import ReviewCandidate from "../pages/screening/ReviewCandidate";

import UsersRolesList from "../pages/admin/UsersRolesList";
import RolesLayout from "../pages/admin/RolesLayout";
import RolesHome from "../pages/admin/RolesHome";

import InterviewsLayout from "../pages/interviews/InterviewsLayout";
import InterviewsHome from "../pages/interviews/InterviewsHome";
import InterviewList from "../pages/interviews/InterviewList";

import FeedbackLayout from "../pages/feedback/FeedbackLayout";
import FeedbackHome from "../pages/feedback/FeedbackHome";
import FeedbackJobsList from "../pages/feedback/FeedbackJobsList";
import FeedbackCandidatesList from "../pages/feedback/FeedbackCandidatesList";
import FeedbackCandidateRounds from "../pages/feedback/FeedbackCandidateRounds";
import GiveFeedback from "../pages/feedback/GiveFeedback";
import ViewFeedback from "../pages/feedback/ViewFeedback";

import RecruiterDecisionLayout from "../pages/recruiter-decisions/RecruiterDecisionLayout";
import RecruiterDecisionJobsList from "../pages/recruiter-decisions/RecruiterDecisionJobsList";
import RecruiterDecisionCandidatesList from "../pages/recruiter-decisions/RecruiterDecisionCandidatesList";
import RecruiterDecisionCandidateRounds from "../pages/recruiter-decisions/RecruiterDecisionCandidateRounds";
import RecruiterRoundDecision from "../pages/recruiter-decisions/RecruiterRoundDecision";
import RecruiterCompletedDecision from "../pages/recruiter-decisions/RecruiterCompletedDecision";

import ReviewerManagementLayout from "../pages/reviewer-management/ReviewerManagementLayout";
import PendingAssignments from "../pages/reviewer-management/PendingAssignments";
import CompletedAssignments from "../pages/reviewer-management/CompletedAssignments";
import AssignReviewers from "../pages/reviewer-management/AssignReviewers"; 
import ModifyReviewers from "../pages/reviewer-management/ModifyReviewers";
import ViewReviewers from "../pages/reviewer-management/ViewReviewers";

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

          <Route path="/dashboard/admin" element={<RolesLayout />}>
            <Route index element={<RolesHome />} />
            <Route path="roles" element={<UsersRolesList />} />
          </Route>


          <Route path="/dashboard/candidates" element={<CandidatesLayout />}>
            <Route index element={<CandidatesHome />} />
            <Route path="create" element={<CreateCandidate />} />
            <Route
              path="/dashboard/candidates/upload-excel"
              element={<UploadCandidatesExcel />}
            />
            <Route
              path="/dashboard/candidates/list"
              element={<CandidatesList />}
            />
            <Route
              path=":candidateId"
              element={<CandidateDetails />}
            />
          </Route>

          <Route path="screening" element={<ScreeningLayout />}>
            {/* <Route index element={<ScreeningHome />} /> */}
            <Route index element={<ScreeningJobsList />} />
            <Route
              path=":jobId"
              element={<JobScreeningCandidates />}
            />
            <Route
              path=":jobId/review/:candidateJobId"
              element={<ReviewCandidate />}
            />
          </Route>

          <Route path="/dashboard/interviews" element={<InterviewsLayout />}>
            <Route index element={<InterviewsHome />} />
          </Route>

          <Route path="/dashboard/feedback" element={<FeedbackLayout />}>
            <Route index element={<FeedbackJobsList />} />
            <Route path=":jobId" element={<FeedbackCandidatesList />} />
            <Route path=":jobId/candidate/:candidateId" element={<FeedbackCandidateRounds />} />
            <Route path=":jobId/candidate/:candidateId/round/:candidateRoundId/give-feedback" element={<GiveFeedback />} />
            <Route path=":jobId/candidate/:candidateId/round/:candidateRoundId/view-feedback" element={<ViewFeedback />} />
          </Route>

          <Route path="/dashboard/recruiter-decisions" element={<RecruiterDecisionLayout />}>
            <Route index element={<RecruiterDecisionJobsList />} />
            <Route path=":jobId" element={<RecruiterDecisionCandidatesList />} />
            <Route path=":jobId/candidate/:candidateId" element={<RecruiterDecisionCandidateRounds />} />
            <Route path=":jobId/candidate/:candidateId/round/:candidateRoundId/decision" element={<RecruiterRoundDecision />} />
            <Route path=":jobId/candidate/:candidateId/round/:candidateRoundId/completed-decision" element={<RecruiterCompletedDecision />} />
            
          </Route>

          <Route path="/dashboard/reviewer-management" element={<ReviewerManagementLayout />}>
            <Route index element={<PendingAssignments />} />
            <Route path="pending" element={<PendingAssignments />} />
            <Route path="completed" element={<CompletedAssignments />} />
            <Route path="assign/:jobId" element={<AssignReviewers />} /> 
            <Route path="modify/:jobId" element={<ModifyReviewers />} />
            <Route path="view/:jobId" element={<ViewReviewers />} />
          </Route>

        </Route>
      </Route>
    </Routes>
  );
}

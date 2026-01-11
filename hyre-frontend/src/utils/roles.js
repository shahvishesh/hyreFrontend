/**
 * Role constants for the application
 */
export const ROLES = {
  ADMIN: "Admin",
  HR: "HR",
  RECRUITER: "Recruiter",
  INTERVIEWER: "Interviewer",
  REVIEWER: "Reviewer",
  CANDIDATE: "Candidate",
};

/**
 * Permission mappings for different features
 */
export const PERMISSIONS = {
  // Dashboard - All authenticated users
  DASHBOARD: [],
  
  // Jobs - Recruiter only
  JOBS: [ROLES.RECRUITER],
  
  // Candidates - Recruiter only
  CANDIDATES: [ROLES.RECRUITER],
  
  // Interviews - Interviewer only
  INTERVIEWS: [ROLES.INTERVIEWER],
  
  // Admin/Role Management - Admin only
  ADMIN: [ROLES.ADMIN],
  
  // Screening - Reviewer only
  SCREENING: [ROLES.REVIEWER],
  
  // Feedback - Interviewer only
  FEEDBACK: [ROLES.INTERVIEWER],
  
  // Recruiter Decisions - Recruiter only
  RECRUITER_DECISIONS: [ROLES.RECRUITER],
  
  // Recruiter Screening - Recruiter only
  RECRUITER_SCREENING: [ROLES.RECRUITER],
  
  // Reviewer Management - Recruiter only
  REVIEWER_MANAGEMENT: [ROLES.RECRUITER],
  
  // Interviewer Management - Recruiter only
  INTERVIEWER_MANAGEMENT: [ROLES.RECRUITER],
  
  // Schedule Interview - Recruiter only
  SCHEDULE_INTERVIEW: [ROLES.RECRUITER],
};

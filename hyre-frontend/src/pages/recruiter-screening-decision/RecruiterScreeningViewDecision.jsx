import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import { ArrowBack, Description } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getCandidateById } from "../../api/candidates.api";
import { getJobById } from "../../api/jobs.api";
import { getSkills } from "../../api/skills.api";
import axiosInstance from "../../api/axiosInstance";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5007";

export default function RecruiterScreeningViewDecision() {
  const navigate = useNavigate();
  const { candidateId, jobId } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [job, setJob] = useState(null);
  const [review, setReview] = useState(null);
  const [recruiterDecision, setRecruiterDecision] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCandidateById(candidateId),
      getJobById(jobId),
      axiosInstance.get(`/api/CandidateReview/candidate/${candidateId}/job/${jobId}`),
      axiosInstance.get(`/api/CandidateReview/candidate/${candidateId}/job/${jobId}/recruiter-decision`),
      getSkills(),
    ])
      .then(
        ([candidateRes, jobRes, reviewRes, recruiterDecisionRes, skillsRes]) => {
          setCandidate(candidateRes.data.candidate);
          setJob(jobRes.data);
          setReview(reviewRes.data);
          setRecruiterDecision(recruiterDecisionRes.data);
          setSkills(skillsRes.data);
        }
      )
      .catch(() =>
        toast.error("Failed to load screening details")
      )
      .finally(() => setLoading(false));
  }, [candidateId, jobId]);

  if (loading) return <CircularProgress />;

  if (!candidate || !job || !review) {
    return (
      <Typography color="error">
        Unable to load screening details
      </Typography>
    );
  }

  // Create skills map for easy lookup
  const skillsMap = {};
  skills.forEach((skill) => {
    skillsMap[skill.skillID] = skill.skillName;
  });

  return (
    <Box>
      {/* Header */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Typography variant="h5" mb={3}>
        Screening Review (Read Only)
      </Typography>

      {/* ================= Review Details ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Review Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Reviewer
              </Typography>
              <Typography>{review.reviewerName}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Review Decision
              </Typography>
              <Chip 
                label={review.decision} 
                color={review.decision === "Shortlist" ? "success" : "error"}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Reviewed At
              </Typography>
              <Typography>
                {new Date(review.reviewedAt).toLocaleDateString()} at{" "}
                {new Date(review.reviewedAt).toLocaleTimeString()}
              </Typography>
            </Grid>

            {recruiterDecision?.recruiterDecision && (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Recruiter Decision
                  </Typography>
                  <Chip 
                    label={recruiterDecision.recruiterDecision} 
                    color={recruiterDecision.recruiterDecision === "Shortlisted" ? "success" : "error"}
                    size="small" 
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Recruiter
                  </Typography>
                  <Typography>{recruiterDecision.recruiterName || "-"}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Decision Made At
                  </Typography>
                  <Typography>
                    {recruiterDecision.recruiterActionAt
                      ? `${new Date(recruiterDecision.recruiterActionAt).toLocaleDateString()} at ${new Date(recruiterDecision.recruiterActionAt).toLocaleTimeString()}`
                      : "-"}
                  </Typography>
                </Grid>
              </>
            )}

            {review.comment && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Reviewer Comment
                </Typography>
                <Typography>{review.comment}</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* ================= Candidate Summary ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Candidate Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography>
                {candidate.firstName} {candidate.lastName}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography>{candidate.email || "-"}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography>{candidate.phone || "-"}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Experience
              </Typography>
              <Typography>
                {candidate.experienceYears ?? 0} years
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Typography>{candidate.status}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Claimed Skills
              </Typography>
              {candidate.skills && candidate.skills.length > 0 ? (
                candidate.skills.map((s) => (
                  <Chip
                    key={s.skillID}
                    label={`${s.skillName} (${s.yearsOfExperience ?? 0}y)`}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))
              ) : (
                <Typography>-</Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Resume
              </Typography>
              {candidate.resumePath ? (
                <Button
                  startIcon={<Description />}
                  variant="outlined"
                  onClick={() =>
                    window.open(
                      `${API_BASE_URL}/api/Candidate/${candidate.candidateID}/resume`,
                      "_blank"
                    )
                  }
                >
                  View Resume
                </Button>
              ) : (
                <Typography>-</Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ================= Job Details ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Job Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Title
              </Typography>
              <Typography>{job.title}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Company
              </Typography>
              <Typography>{job.companyName}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Location
              </Typography>
              <Typography>{job.location}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Experience Required
              </Typography>
              <Typography>
                {job.minExperience} - {job.maxExperience} years
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Job Type
              </Typography>
              <Typography>{job.jobType}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Workplace Type
              </Typography>
              <Typography>{job.workplaceType}</Typography>
            </Grid>

            {job.description && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography>{job.description}</Typography>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Job Skills
              </Typography>
              {job.skills && job.skills.length > 0 ? (
                job.skills.map((s) => (
                  <Chip
                    key={s.skillID}
                    label={`${s.skillName} (${s.skillType})`}
                    color={s.skillType === "Required" ? "primary" : "default"}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))
              ) : (
                <Typography>-</Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ================= Verified Skills ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Skill Verification by Reviewer
          </Typography>

          {(() => {
            const verifiedSkills = review.skills?.filter((skill) => skill.isVerified) || [];
            
            if (verifiedSkills.length === 0) {
              return (
                <Typography color="text.secondary">
                  No skills verified by reviewer
                </Typography>
              );
            }

            return (
              <Grid container spacing={2}>
                {verifiedSkills.map((skill) => {
                  return (
                    <Grid item xs={12} sm={6} key={skill.skillId}>
                      <Box
                        sx={{
                          p: 2,
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="subtitle2">
                          {skillsMap[skill.skillId] || `Skill ID: ${skill.skillId}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Verified: {skill.verifiedYearsOfExperience ?? 0} years
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            );
          })()}
        </CardContent>
      </Card>
    </Box>
  );
}

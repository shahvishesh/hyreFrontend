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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ArrowBack, Description, ExpandMore } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getCandidateById } from "../../api/candidates.api";
import { getJobById } from "../../api/jobs.api";
import axiosInstance from "../../api/axiosInstance";

import StarRating from "../../components/common/StarRating";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5007";

export default function RecruiterCompletedDecision() {
  const navigate = useNavigate();
  const { candidateRoundId, candidateId, jobId } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [job, setJob] = useState(null);
  const [roundDetail, setRoundDetail] = useState(null);
  const [aggregatedFeedback, setAggregatedFeedback] = useState(null);
  const [recruiterDecision, setRecruiterDecision] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCandidateById(candidateId),
      getJobById(jobId),
      axiosInstance.get(`/api/RecruiterInterviewFeedback/round-detail/${candidateRoundId}`),
      axiosInstance.get(`/api/RecruiterInterviewFeedback/${candidateRoundId}/feedback`),
      axiosInstance.get(`/api/RecruiterDecision/${candidateRoundId}/recruiter-decision`),
    ])
      .then(
        ([candidateRes, jobRes, roundRes, feedbackRes, decisionRes]) => {
          setCandidate(candidateRes.data.candidate);
          setJob(jobRes.data);
          setRoundDetail(roundRes.data);
          setAggregatedFeedback(feedbackRes.data);
          setRecruiterDecision(decisionRes.data);
        }
      )
      .catch(() =>
        toast.error("Failed to load feedback details")
      )
      .finally(() => setLoading(false));
  }, [candidateId, jobId, candidateRoundId]);

  if (loading) return <CircularProgress />;

  if (!candidate || !job || !roundDetail || !aggregatedFeedback || !recruiterDecision) {
    return (
      <Typography color="error">
        Unable to load feedback
      </Typography>
    );
  }

  const skillMap = {};
  aggregatedFeedback.skillAggregates.forEach((s) => {
    skillMap[s.skillID] = s;
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
        Recruiter Decision - Interview Feedback Review (Completed)
      </Typography>

      {/* ================= Round Details ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Interview Round Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Round
              </Typography>
              <Typography>
                {roundDetail.roundName} (Sequence {roundDetail.sequenceNo})
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Type
              </Typography>
              <Typography>{roundDetail.roundType}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip label={roundDetail.status} size="small" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Interview Mode
              </Typography>
              <Typography>{roundDetail.interviewMode || "-"}</Typography>
            </Grid>

            {roundDetail.scheduledDate && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Scheduled Date
                </Typography>
                <Typography>
                  {new Date(roundDetail.scheduledDate).toLocaleDateString()}
                  {roundDetail.startTime && ` at ${roundDetail.startTime}`}
                </Typography>
              </Grid>
            )}

            {roundDetail.durationMinutes && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Duration
                </Typography>
                <Typography>{roundDetail.durationMinutes} minutes</Typography>
              </Grid>
            )}

            {roundDetail.meetingLink && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Meeting Link
                </Typography>
                <Typography
                  component="a"
                  href={roundDetail.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "primary.main" }}
                >
                  {roundDetail.meetingLink}
                </Typography>
              </Grid>
            )}

            {roundDetail.isPanelRound && roundDetail.panelMembers && roundDetail.panelMembers.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Panel Members
                </Typography>
                {roundDetail.panelMembers.map((member) => (
                  <Chip
                    key={member.interviewerID}
                    label={`${member.firstName} ${member.lastName}${member.email ? ` (${member.email})` : ""}`}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Grid>
            )}

            {!roundDetail.isPanelRound && roundDetail.interviewer && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Interviewer
                </Typography>
                <Typography>
                  {roundDetail.interviewer.firstName} {roundDetail.interviewer.lastName}
                  {roundDetail.interviewer.email && ` (${roundDetail.interviewer.email})`}
                </Typography>
              </Grid>
            )}

            {/* Feedback Summary */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">
                Feedback Collection Status
              </Typography>
              <Typography>
                {aggregatedFeedback.feedbackSubmitted} of {aggregatedFeedback.totalInterviewers} interviewer(s) submitted feedback
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ================= Candidate Summary ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Candidate
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
              <Typography>
                {candidate.email}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Experience
              </Typography>
              <Typography>
                {candidate.experienceYears ?? 0} years
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Claimed Skills
              </Typography>
              {candidate.skills.length > 0 ? (
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

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Resume
              </Typography>
              {candidate.resumePath ? (
                <Button
                  startIcon={<Description />}
                  variant="outlined"
                  size="small"
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

      {/* ================= Job Context ================= */}
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
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Job Skills
              </Typography>
              {job.skills.map((s) => (
                <Chip
                  key={s.skillID}
                  label={`${s.skillName} (${s.skillType})`}
                  color={s.skillType === "Required" ? "primary" : "default"}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ================= Aggregated Skill Ratings ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Aggregated Skill Ratings
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Skill</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="center">Average Rating</TableCell>
                  <TableCell align="center">Reviewers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {job.skills.map((skill) => {
                  const aggregate = skillMap[skill.skillID];
                  return (
                    <TableRow key={skill.skillID}>
                      <TableCell>{skill.skillName}</TableCell>
                      <TableCell>
                        <Chip
                          label={skill.skillType}
                          color={skill.skillType === "Required" ? "primary" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {aggregate ? (
                          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                            <StarRating value={aggregate.averageRating} readOnly />
                            <Typography variant="body2" color="text.secondary">
                              ({aggregate.averageRating.toFixed(1)})
                            </Typography>
                          </Box>
                        ) : (
                          <Typography color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {aggregate ? aggregate.reviewerCount : 0}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* ================= Individual Interviewer Feedbacks ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Individual Interviewer Feedback
          </Typography>

          {aggregatedFeedback.individualFeedbacks.length > 0 ? (
            aggregatedFeedback.individualFeedbacks.map((feedback, index) => (
              <Accordion key={feedback.interviewerId} defaultExpanded={index === 0}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    <Typography variant="subtitle1">
                      {feedback.interviewerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Submitted {new Date(feedback.submittedAt).toLocaleString()}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    {/* Skill Ratings */}
                    <Typography variant="subtitle2" mb={1}>
                      Skill Ratings
                    </Typography>
                    {(() => {
                      const ratingMap = {};
                      feedback.skillRatings.forEach((r) => {
                        ratingMap[r.skillID] = r.rating;
                      });

                      return job.skills.map((skill) => (
                        <Box
                          key={skill.skillID}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography>
                            {skill.skillName}
                            {skill.skillType === "Required" && " *"}
                          </Typography>
                          <StarRating value={ratingMap[skill.skillID] || 0} readOnly />
                        </Box>
                      ));
                    })()}

                    {/* Overall Comment */}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" mb={1}>
                      Overall Comment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feedback.overallComment || "No comment provided"}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography color="text.secondary">
              No feedback submitted yet
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* ================= Recruiter Decision (Read Only) ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Recruiter Decision
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Decision
              </Typography>
              <Chip 
                label={recruiterDecision.recruiterDecision || "N/A"}
                color={
                  recruiterDecision.recruiterDecision === "Reject" 
                    ? "error" 
                    : recruiterDecision.recruiterDecision === "MoveNext" || recruiterDecision.recruiterDecision === "Shortlist"
                    ? "success"
                    : "default"
                }
                size="medium"
              />
            </Grid>

            {recruiterDecision.recruiterDecisionAt && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Decision Date
                </Typography>
                <Typography>
                  {new Date(recruiterDecision.recruiterDecisionAt).toLocaleString()}
                </Typography>
              </Grid>
            )}

            {recruiterDecision.recruiterName && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Decided By
                </Typography>
                <Typography>{recruiterDecision.recruiterName}</Typography>
              </Grid>
            )}

            
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

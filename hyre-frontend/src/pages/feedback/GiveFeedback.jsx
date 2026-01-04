import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  TextField,
  Divider,
  Chip,
} from "@mui/material";
import { ArrowBack, Description } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getCandidateById } from "../../api/candidates.api";
import { getJobById } from "../../api/jobs.api";
import { getRoundDetail } from "../../api/interviews.api";
import { submitInterviewFeedback } from "../../api/interviewFeedback.api";

import StarRating from "../../components/common/StarRating";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5007";

export default function GiveFeedback() {
  const navigate = useNavigate();
  const { candidateRoundId, candidateId, jobId } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [job, setJob] = useState(null);
  const [roundDetail, setRoundDetail] = useState(null);

  const [overallComment, setOverallComment] = useState("");
  const [skillRatings, setSkillRatings] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  Promise.all([
    getCandidateById(candidateId),
    getJobById(jobId),
    getRoundDetail(candidateRoundId),
  ])
    .then(([candidateRes, jobRes, roundRes]) => {
      setCandidate(candidateRes.data.candidate);
      setJob(jobRes.data);
      setRoundDetail(roundRes.data);
    })
    .catch(() => {
      toast.error("Failed to load feedback data");
    })
    .finally(() => setLoading(false));
}, [candidateId, jobId, candidateRoundId]);

if (loading) {
  return <CircularProgress />;
}

if (!candidate || !job || !roundDetail) {
  return (
    <Typography color="error">
      Unable to load feedback details
    </Typography>
  );
}

const validateFeedback = () => {
  if (!candidateRoundId) {
    toast.error("Invalid interview round");
    return false;
  }

  const ratedSkillIds = Object.keys(skillRatings);

  if (ratedSkillIds.length === 0) {
    toast.error("Please rate at least one skill");
    return false;
  }

  const requiredSkillIds = job.skills
    .filter((s) => s.skillType === "Required")
    .map((s) => s.skillID);

  const missingRequired = requiredSkillIds.filter(
    (id) => !skillRatings[id]
  );

  if (missingRequired.length > 0) {
    toast.error(
      "Please rate all required skills before submitting"
    );
    return false;
  }

  return true;
};

const buildPayload = () => {
  return {
    CandidateRoundID: Number(candidateRoundId),
    OverallComment: overallComment || null,
    SkillRatings: Object.entries(skillRatings).map(
      ([skillId, rating]) => ({
        SkillID: Number(skillId),
        Rating: Number(rating),
      })
    ),
  };
};

const handleSubmitFeedback = async () => {
  if (!validateFeedback()) return;

  const payload = buildPayload();

  try {
    await submitInterviewFeedback(payload);

    toast.success("Feedback submitted successfully");

    navigate(-1);
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        "Failed to submit feedback"
    );
  }
};

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
      Submit Interview Feedback
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

          {roundDetail.recruiterDecision && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Recruiter Decision
              </Typography>
              <Typography>
                {roundDetail.recruiterDecision}
                {roundDetail.recruiterDecisionAt && (
                  <Typography component="span" variant="body2" color="text.secondary" ml={1}>
                    (on {new Date(roundDetail.recruiterDecisionAt).toLocaleDateString()})
                  </Typography>
                )}
              </Typography>
            </Grid>
          )}
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

    {/* ================= Skill Ratings (next step) ================= */}
    {/* ================= Skill Ratings ================= */}
<Card sx={{ mb: 3 }}>
  <CardContent>
    <Typography variant="h6" mb={2}>
      Skill Ratings
    </Typography>

    {job.skills.map((skill) => (
      <Box
        key={skill.skillID}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography>
          {skill.skillName}
          {skill.skillType === "Required" && (
            <Typography
              component="span"
              color="error"
              ml={1}
            >
              *
            </Typography>
          )}
        </Typography>

        <StarRating
          value={skillRatings[skill.skillID] || 0}
          onChange={(rating) =>
            setSkillRatings((prev) => ({
              ...prev,
              [skill.skillID]: rating,
            }))
          }
        />
      </Box>
    ))}
  </CardContent>
</Card>


    {/* ================= Overall Comment ================= */}
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" mb={1}>
          Overall Feedback
        </Typography>

        <TextField
          multiline
          rows={4}
          fullWidth
          value={overallComment}
          onChange={(e) =>
            setOverallComment(e.target.value)
          }
        />
      </CardContent>
    </Card>

    {/* ================= Submit ================= */}
    <Button
  variant="contained"
  onClick={() => {
    if (!validateFeedback()) return;
    handleSubmitFeedback();
  }}
>
  Submit Feedback
</Button>

  </Box>
);
}
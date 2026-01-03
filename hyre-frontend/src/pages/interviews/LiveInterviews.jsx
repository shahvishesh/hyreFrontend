import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getLiveInterviewDetails } from "../../api/interviews.api";
import { Description } from "@mui/icons-material";
import { VideoCall } from "@mui/icons-material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5007";


export default function LiveInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveInterviewDetails()
      .then((res) => {
        setInterviews(res.data);
      })
      .catch(() =>
        toast.error("Failed to load live interviews")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;

  if (interviews.length === 0) {
    return (
      <Typography>
        No live interviews at the moment.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Live Interviews
      </Typography>

      {interviews.map((i) => (
        <Card
          key={i.candidateRoundID}
          sx={{ mb: 3 }}
        >
          <CardContent>
            {/* ================= Round Info ================= */}
            <Typography variant="h6">
              {i.roundName}
            </Typography>

            <Typography color="text.secondary">
              {i.roundType} •{" "}
              {i.isPanelRound
                ? "Panel Round"
                : "Single Interview"}
            </Typography>

            <Box mt={1} mb={2}>
              <Chip
                label={i.status}
                color="success"
                size="small"
                sx={{ mr: 1 }}
              />

              {i.interviewMode && (
                <Chip
                  label={i.interviewMode}
                  size="small"
                />
              )}
            </Box>

            <Typography variant="body2">
              <strong>Start:</strong>{" "}
              {i.scheduledStart
                ? new Date(
                    i.scheduledStart
                  ).toLocaleString()
                : "-"}
            </Typography>

            <Typography variant="body2" mb={2}>
              <strong>End:</strong>{" "}
              {i.scheduledEnd
                ? new Date(
                    i.scheduledEnd
                  ).toLocaleString()
                : "-"}
            </Typography>

            {/* Join Meeting */}
            {i.meetingLink && (
            <Button
                variant="contained"
                color="success"
                startIcon={<VideoCall />}
                onClick={() => window.open(i.meetingLink, "_blank")}
                sx={{ mt: 2 }}
            >
                Join {i.interviewMode ?? "Interview"}
            </Button>
            )}


            <Divider sx={{ mb: 2 }} />

            {/* ================= Candidate ================= */}
            <Typography variant="subtitle1" mb={1}>
              Candidate
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>
                  {i.candidate.firstName}{" "}
                  {i.candidate.lastName}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>
                  {i.candidate.experienceYears ??
                    0}{" "}
                  yrs experience
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>
                  {i.candidate.email}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>
                  {i.candidate.phone}
                </Typography>
              </Grid>
            </Grid>
            {/* Resume */}
            <Grid item xs={6}>
            <Typography variant="subtitle2">
                Resume
            </Typography>

            {i.candidate.resumePath ? (
                <Button
                size="small"
                variant="outlined"
                startIcon={<Description />}
                onClick={() =>
                    window.open(
                    `${API_BASE_URL}/api/Candidate/${i.candidate.candidateID}/resume`,
                    "_blank"
                    )
                }
                >
                View Resume
                </Button>
            ) : (
                <Typography variant="body2">-</Typography>
            )}
            </Grid>


            {/* Candidate Skills */}
            <Box mt={1}>
              <Typography variant="subtitle2">
                Candidate Skills
              </Typography>

              {i.candidate.skills?.length > 0 ? (
                i.candidate.skills.map((s) => (
                  <Chip
                    key={s.skillID}
                    label={`${s.skillName} (${s.yearsOfExperience ?? 0}y)`}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))
              ) : (
                <Typography variant="body2">
                  No skills listed
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* ================= Job ================= */}
            <Typography variant="subtitle1" mb={1}>
              Job
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>
                  {i.job.title}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>
                  {i.job.companyName}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>
                  {i.job.location}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>
                  {i.job.jobType} •{" "}
                  {i.job.workplaceType}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2">
                  Experience:{" "}
                  {i.job.minExperience ?? 0} -{" "}
                  {i.job.maxExperience ?? 0} yrs
                </Typography>
              </Grid>
            </Grid>

            {/* Job Skills */}
            <Box mt={1}>
              <Typography variant="subtitle2">
                Job Skills
              </Typography>

              {i.job.skills?.map((s) => (
                <Chip
                  key={s.skillID}
                  label={`${s.skillName} (${s.skillType})`}
                  color={
                    s.skillType === "Required"
                      ? "primary"
                      : "default"
                  }
                  size="small"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>

            {/* ================= Panel Members ================= */}
            {i.isPanelRound &&
              i.panelMembers?.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1">
                    Panel Members
                  </Typography>

                  {i.panelMembers.map((p) => (
                    <Chip
                      key={p.interviewerID}
                      label={`${p.firstName} ${p.lastName}`}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </>
              )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobById } from "../../api/jobs.api";
import { toast } from "react-toastify";

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobById(jobId)
      .then((res) => {
        setJob(res.data);
      })
      .catch(() => toast.error("Failed to load job details"))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!job) {
    return <Typography>No job found</Typography>;
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/dashboard/jobs/list")}
        >
          Back
        </Button>

        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() =>
            navigate(`/dashboard/jobs/edit/${job.jobId ?? job.id}`)
          }
        >
          Edit Job
        </Button>
      </Box>

      {/* Job Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5">{job.title}</Typography>
          <Typography color="text.secondary" mb={2}>
            {job.companyName} • {job.location}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>
                <strong>Experience:</strong>{" "}
                {job.minExperience} - {job.maxExperience} years
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>
                <strong>Job Type:</strong> {job.jobType}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>
                <strong>Workplace:</strong> {job.workplaceType}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">Description</Typography>
          <Typography>{job.description}</Typography>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Skills
          </Typography>

          {job.skills?.map((skill, index) => (
            <Chip
              key={`${skill.skillID}-${index}`}
              label={`${skill.skillName ?? ""} (${skill.skillType})`}
              color={skill.skillType === "Required" ? "primary" : "default"}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}

          {job.skills?.length === 0 && (
            <Typography>No skills added</Typography>
          )}
        </CardContent>
      </Card>

      {/* Interview Rounds */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Interview Rounds
          </Typography>

          {job.interviewRounds?.map((round, index) => (
            <Box key={`${round.sequenceNo}-${index}`} mb={2}>
              <Typography>
                <strong>
                  Round {round.sequenceNo}: {round.roundName}
                </strong>
              </Typography>
              <Typography color="text.secondary">
                {round.roundType} • {round.interviewMode} •{" "}
                {round.durationMinutes} mins
              </Typography>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}

          {job.interviewRounds?.length === 0 && (
            <Typography>No interview rounds defined</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

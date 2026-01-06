import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getJobById } from "../../api/jobs.api";
import {
  getAssignedReviewerJobsByJobId,
} from "../../api/jobReviewer.api";

export default function ViewReviewers() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [assignedReviewers, setAssignedReviewers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getJobById(jobId),
      getAssignedReviewerJobsByJobId(jobId),
    ])
      .then(([jobRes, assignedRes]) => {
        setJob(jobRes.data);
        setAssignedReviewers(assignedRes.data);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!job) {
    return <Typography color="error">Unable to load job details</Typography>;
  }

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
        View Assigned Reviewers
      </Typography>

      {/* Job Details */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" mb={3}>
            Job Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Title
              </Typography>
              <Typography variant="body1">{job.title}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Company
              </Typography>
              <Typography variant="body1">{job.companyName}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Location
              </Typography>
              <Typography variant="body1">{job.location}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Experience Range
              </Typography>
              <Typography variant="body1">
                {job.minExperience} - {job.maxExperience} years
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Status
              </Typography>
              <Chip label={job.status} size="medium" />
            </Grid>

            {job.description && (
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Description
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {job.description}
                </Typography>
              </Grid>
            )}

            {job.skills && job.skills.length > 0 && (
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Required Skills
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                  {job.skills.map((skill) => (
                    <Chip
                      key={skill.skillID}
                      label={`${skill.skillName}${skill.minExperience ? ` (${skill.minExperience}+ yrs)` : ""}`}
                      color={
                        skill.skillType === "Required" ? "primary" : "default"
                      }
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Assigned Reviewers */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" mb={3}>
            Assigned Reviewers
          </Typography>

          {assignedReviewers.length === 0 ? (
            <Typography color="text.secondary">
              No reviewers assigned to this job
            </Typography>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Assigned At</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignedReviewers.map((reviewer) => (
                      <TableRow key={reviewer.jobReviewerId}>
                        <TableCell>{reviewer.reviewerName}</TableCell>
                        <TableCell>
                          {new Date(reviewer.assignedAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box mt={2}>
                <Typography variant="body2" color="primary" fontWeight={500}>
                  {assignedReviewers.length} reviewer(s) assigned
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Back Button */}
      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
}

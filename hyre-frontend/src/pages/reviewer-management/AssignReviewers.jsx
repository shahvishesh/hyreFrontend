import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  getAllReviewers,
  assignReviewers,
} from "../../api/jobReviewer.api";

export default function AssignReviewers() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewers, setSelectedReviewers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getJobById(jobId), getAllReviewers()])
      .then(([jobRes, reviewersRes]) => {
        setJob(jobRes.data);
        setReviewers(reviewersRes.data);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleToggleReviewer = (reviewerId) => {
    setSelectedReviewers((prev) =>
      prev.includes(reviewerId)
        ? prev.filter((id) => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  const handleAssign = async () => {
    if (selectedReviewers.length === 0) {
      toast.warning("Please select at least one reviewer");
      return;
    }

    setSubmitting(true);
    try {
      await assignReviewers({
        jobId: parseInt(jobId),
        reviewerIds: selectedReviewers,
      });
      toast.success("Reviewers assigned successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to assign reviewers");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

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
        Assign Reviewers to Job
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

      {/* Reviewers Selection */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" mb={3}>
            Select Reviewers
          </Typography>

          {reviewers.length === 0 ? (
            <Typography color="text.secondary">
              No reviewers available
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="100" sx={{ px: 3 }}>
                      <strong>Select</strong>
                    </TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewers.map((reviewer) => (
                    <TableRow
                      key={reviewer.id}
                      hover
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleReviewer(reviewer.id);
                      }}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell width="100" sx={{ px: 3 }}>
                        <Checkbox
                          checked={selectedReviewers.includes(
                            reviewer.id
                          )}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell>
                        {reviewer.firstName} {reviewer.lastName}
                      </TableCell>
                      <TableCell>{reviewer.email || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {selectedReviewers.length > 0 && (
            <Box mt={2}>
              <Typography variant="body2" color="primary" fontWeight={500}>
                {selectedReviewers.length} reviewer(s) selected
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Assign Button */}
      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleAssign}
          disabled={submitting || selectedReviewers.length === 0}
        >
          {submitting ? <CircularProgress size={24} /> : "Assign Reviewers"}
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate(-1)}
          disabled={submitting}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

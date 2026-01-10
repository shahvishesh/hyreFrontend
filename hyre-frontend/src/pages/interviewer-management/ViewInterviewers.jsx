import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getJobById } from "../../api/jobs.api";

export default function ViewInterviewers() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [jobDetails, setJobDetails] = useState(null);
  const [assignedInterviewers, setAssignedInterviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!jobId || isNaN(Number(jobId))) {
      setError("Invalid job ID");
      setLoading(false);
      return;
    }

    Promise.all([
      getJobById(jobId),
      axiosInstance.get(
        `/api/JobInterviewer/${jobId}/assigned-interviewers`
      ),
    ])
      .then(([jobRes, assignedRes]) => {
        setJobDetails(jobRes.data);
        setAssignedInterviewers(assignedRes.data.interviewers || []);
        setError(null);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Failed to load data";
        setError(errorMsg);
        toast.error(errorMsg);
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) return <CircularProgress />;

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* ================= HEADER & JOB DETAILS ================= */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Typography variant="h5" mb={3}>
        View Interviewer Assignments
      </Typography>

      {jobDetails && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Job Details
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Typography>
                  <strong>Title:</strong> {jobDetails.title}
                </Typography>
                <Typography>
                  <strong>Company:</strong> {jobDetails.companyName}
                </Typography>
                <Typography>
                  <strong>Location:</strong> {jobDetails.location || "N/A"}
                </Typography>
              </Box>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Typography>
                  <strong>Experience:</strong> {jobDetails.minExperience} - {jobDetails.maxExperience} yrs
                </Typography>
                <Typography>
                  <strong>Type:</strong> {jobDetails.jobType}
                </Typography>
                <Typography>
                  <strong>Workplace:</strong> {jobDetails.workplaceType}
                </Typography>
                <Chip label={jobDetails.status} color="primary" size="small" />
              </Box>
              {jobDetails.skills && jobDetails.skills.length > 0 && (
                <Box>
                  <Typography component="span">
                    <strong>Skills:</strong>{" "}
                  </Typography>
                  {jobDetails.skills.map((skill, idx) => (
                    <Chip
                      key={skill.skillID || idx}
                      label={skill.skillName}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ================= ASSIGNED INTERVIEWERS ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Assigned Interviewers
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>System Role</TableCell>
                <TableCell>Interviewer Role</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {assignedInterviewers.map((interviewer) => (
                <TableRow key={interviewer.interviewerID}>
                  <TableCell>
                    {interviewer.fullName || "-"}
                  </TableCell>
                  <TableCell>
                    {interviewer.email || "-"}
                  </TableCell>
                  <TableCell>
                    {interviewer.designation || "-"}
                  </TableCell>
                  <TableCell>
                    {interviewer.systemRoles && interviewer.systemRoles.length > 0 
                      ? interviewer.systemRoles.join(", ") 
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={interviewer.interviewRole} 
                      color="primary" 
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}

              {assignedInterviewers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                  >
                    No interviewers assigned to this job
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}

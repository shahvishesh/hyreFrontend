import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAssignedReviewerJobs } from "../../api/jobReviewer.api";

export default function CompletedAssignments() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Load completed jobs ================= */
  const loadJobs = () => {
    setLoading(true);
    getAssignedReviewerJobs()
      .then((res) => {
        setJobs(res.data);
      })
      .catch(() =>
        toast.error("Failed to load assigned reviewer jobs")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Completed Reviewer Assignments
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.jobID|| job.jobId}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.companyName}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  {job.minExperience} - {job.maxExperience} yrs
                </TableCell>
                <TableCell>{job.status}</TableCell>

                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        navigate(
                          `/dashboard/reviewer-management/view/${job.jobID|| job.jobId}`
                        )
                      }
                    >
                      View Reviewers
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        navigate(
                          `/dashboard/reviewer-management/modify/${job.jobID|| job.jobId}`
                        )
                      }
                    >
                      Modify Reviewers
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}

            {jobs.length === 0 && (
              <TableRow >
                <TableCell colSpan={6} align="center">
                  No completed reviewer assignments
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

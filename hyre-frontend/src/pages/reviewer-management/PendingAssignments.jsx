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

import { getPendingReviewerJobs } from "../../api/jobReviewer.api";

export default function PendingAssignments() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPendingReviewerJobs()
      .then((res) => {
        setJobs(res.data);
      })
      .catch(() =>
        toast.error("Failed to load pending reviewer jobs")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Jobs Pending Reviewer Assignment
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
              <TableRow key={job.jobID || job.jobId}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.companyName}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  {job.minExperience} - {job.maxExperience} yrs
                </TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(
                        `/dashboard/reviewer-management/assign/${job.jobID || job.jobId}`
                      )
                    }
                  >
                    Assign Reviewer
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {jobs.length === 0 && (
              <TableRow key="empty-row">
                <TableCell colSpan={6} align="center">
                  No jobs pending reviewer assignment
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

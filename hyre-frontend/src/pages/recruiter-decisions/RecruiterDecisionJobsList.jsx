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
import { getJobs } from "../../api/jobs.api";

export default function FeedbackJobsList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Load jobs ================= */
  useEffect(() => {
    getJobs()
      .then((res) => {
        setJobs(res.data);
      })
      .catch(() =>
        toast.error("Failed to load feedback jobs")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Jobs Requiring Feedback
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
              <TableRow
                key={job.jobID}
                >
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.companyName}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  {job.minExperience} –{" "}
                  {job.maxExperience} yrs
                </TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(
                        `/dashboard/recruiter-decisions/${job.jobID}`
                      )
                    }
                  >
                    View Candidates
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {jobs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                >
                  No jobs found for feedback
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

import {
  Box,
  Button,
  Chip,
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
import axiosInstance from "../../api/axiosInstance";

export default function ScreeningJobsList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Load jobs ================= */
  useEffect(() => {
    axiosInstance
      .get("/api/CandidateRounds/jobs")
      .then((res) => {
        // Sort by pending profiles count (highest first)
        const sortedJobs = [...res.data].sort(
          (a, b) => (b.pendingProfilesCount || 0) - (a.pendingProfilesCount || 0)
        );
        setJobs(sortedJobs);
      })
      .catch(() =>
        toast.error("Failed to load jobs for scheduling interviews")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Jobs Requiring Interview Scheduling
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
              <TableCell align="center">Pending Profiles</TableCell>
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
                  {job.minExperience} -{" "}
                  {job.maxExperience} yrs
                </TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={job.pendingProfilesCount}
                    color={
                      job.pendingProfilesCount > 5
                        ? "error"
                        : job.pendingProfilesCount > 2
                        ? "warning"
                        : job.pendingProfilesCount > 0
                        ? "primary"
                        : "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(
                        `/dashboard/schedule-interview/${job.jobID}`
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
                  colSpan={7}
                  align="center"
                >
                  No jobs found for scheduling interviews
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

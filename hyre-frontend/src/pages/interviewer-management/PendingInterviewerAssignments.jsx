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

import { getPendingInterviewerJobs } from "../../api/JobInterviewer.api";

export default function PendingAssignments() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPendingInterviewerJobs()
      .then((res) => {
        setJobs(res.data);
      })
      .catch(() =>
        toast.error("Failed to load pending interviewer jobs")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Jobs Pending Interviewer Assignment
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Skills</TableCell>
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
                  {job.skills && job.skills.length > 0
                    ? job.skills.map((skill) => skill.skillName).join(", ")
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {job.minExperience} - {job.maxExperience} yrs
                </TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(
                        `/dashboard/interviewer-management/assign/${job.jobID || job.jobId}`
                      )
                    }
                  >
                    Assign Interviewer
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {jobs.length === 0 && (
              <TableRow key="empty-row">
                <TableCell colSpan={7} align="center">
                  No jobs pending interviewer assignment
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

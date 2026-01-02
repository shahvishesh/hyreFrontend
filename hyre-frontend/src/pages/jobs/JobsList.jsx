import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Edit, Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getJobs } from "../../api/jobs.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function JobsList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then((res) => {
        console.log("JOBS API RESPONSE:", res.data);
        setJobs(res.data);
      })
      .catch(() => toast.error("Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Jobs List
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Job Type</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {jobs.map((job) => (
              <TableRow
                key={`${job.jobId ?? job.id}-${job.title}`}
              >
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.companyName}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  {job.minExperience} - {job.maxExperience} yrs
                </TableCell>
                <TableCell>{job.jobType}</TableCell>

                <TableCell align="center">
                  <IconButton
                    onClick={() =>
                      navigate(
                        `/dashboard/jobs/${job.jobId ?? job.id}`
                      )
                    }
                  >
                    <Visibility />
                  </IconButton>

                  <IconButton
                    onClick={() =>
                      navigate(
                        `/dashboard/jobs/edit/${job.jobId ?? job.id}`
                      )
                    }
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {jobs.length === 0 && (
              <TableRow key="no-jobs">
                <TableCell colSpan={6} align="center">
                  No jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

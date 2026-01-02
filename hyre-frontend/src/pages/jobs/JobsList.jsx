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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getJobs, deleteJob } from "../../api/jobs.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function JobsList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔴 Delete dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const loadJobs = () => {
    setLoading(true);
    getJobs()
      .then((res) => {
        console.log("JOBS API RESPONSE:", res.data);
        setJobs(res.data);
      })
      .catch(() => toast.error("Failed to load jobs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Open dialog
  const handleOpenDeleteDialog = (jobID) => {
    setJobToDelete(jobID);
    setOpenDeleteDialog(true);
  };

  // Close dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setJobToDelete(null);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    try {
      await deleteJob(jobToDelete);
      toast.success("Job deleted successfully");
      handleCloseDeleteDialog();
      loadJobs();
    } catch {
      toast.error("Failed to delete job");
    }
  };

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
              <TableRow key={job.jobID}>
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
                      navigate(`/dashboard/jobs/${job.jobID}`)
                    }
                  >
                    <Visibility />
                  </IconButton>

                  <IconButton
                    onClick={() =>
                      navigate(`/dashboard/jobs/edit/${job.jobID}`)
                    }
                  >
                    <Edit />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() =>
                      handleOpenDeleteDialog(job.jobID)
                    }
                  >
                    <Delete />
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

      {/* ================= Delete Confirmation Dialog ================= */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Delete Job</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete this job?  
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

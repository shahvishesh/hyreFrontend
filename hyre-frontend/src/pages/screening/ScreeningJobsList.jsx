import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs } from "../../api/jobs.api";
import { toast } from "react-toastify";

export default function ScreeningJobsList() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then((res) => {
        // ✅ Only OPEN jobs for screening
        const openJobs = res.data.filter(
          (job) => job.status === "Open"
        );
        setJobs(openJobs);
      })
      .catch(() =>
        toast.error("Failed to load screening jobs")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Screening – Open Jobs
      </Typography>

      <Grid container spacing={2}>
        {jobs.map((job) => (
          <Grid item xs={12} md={6} key={job.jobID}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {job.title}
                </Typography>

                <Typography color="text.secondary">
                  {job.companyName} • {job.location}
                </Typography>

                <Typography mt={1}>
                  Experience: {job.minExperience} –{" "}
                  {job.maxExperience} yrs
                </Typography>

                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={() =>
                    navigate(
                      `/dashboard/screening/${job.jobID}`
                    )
                  }
                >
                  View Candidates
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {jobs.length === 0 && (
          <Typography>
            No open jobs available for screening
          </Typography>
        )}
      </Grid>
    </Box>
  );
}

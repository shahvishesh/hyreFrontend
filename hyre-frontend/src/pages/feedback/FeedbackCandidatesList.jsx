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
import { ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

export default function FeedbackCandidatesList() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Load candidates ================= */
  useEffect(() => {
    axiosInstance
      .get(`/api/InterviewFeedback/job/${jobId}/candidates`)
      .then((res) => {
        setCandidates(res.data);
      })
      .catch(() =>
        toast.error("Failed to load interviewed candidates")
      )
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      {/* ================= Back ================= */}
      <Box mb={2}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/dashboard/feedback")}
        >
          Back to Jobs
        </Button>
      </Box>

      <Typography variant="h6" mb={2}>
        Interviewed Candidates
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Skills (Claimed)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {candidates.map((c) => (
              <TableRow key={c.candidateID}>
                <TableCell>
                  {c.firstName} {c.lastName}
                </TableCell>

                <TableCell>{c.email || "-"}</TableCell>

                <TableCell>
                  {c.experienceYears ?? 0} yrs
                </TableCell>

                <TableCell>
                  {c.skills && c.skills.length > 0 ? (
                    c.skills.map((s) => (
                      <Chip
                        key={s.skillID}
                        label={`${s.skillName} (${s.yearsOfExperience ?? 0}y)`}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      -
                    </Typography>
                  )}
                </TableCell>

                <TableCell>{c.status}</TableCell>

                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() =>
                      navigate(
                        `/dashboard/feedback/${jobId}/candidate/${c.candidateID}`
                      )
                    }
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {candidates.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                >
                  No interviewed candidates found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { ArrowBack, Description } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCandidateById } from "../../api/candidates.api";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5007";


export default function CandidateDetails() {
  const { candidateId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= Load candidate ================= */
  useEffect(() => {
    getCandidateById(candidateId)
      .then((res) => {
        setCandidate(res.data.candidate);
      })
      .catch(() => toast.error("Failed to load candidate details"))
      .finally(() => setLoading(false));
  }, [candidateId]);

  if (loading) return <CircularProgress />;

  if (!candidate) {
    return (
      <Typography color="error">
        Candidate not found
      </Typography>
    );
  }

  return (
    <Container maxWidth="md">
      {/* ================= Back ================= */}
      <Box mb={2}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>

      <Typography variant="h5" mb={3}>
        Candidate Details
      </Typography>

      {/* ================= Candidate Info ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Name
              </Typography>
              <Typography>
                {candidate.firstName} {candidate.lastName}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Status
              </Typography>
              <Chip
                label={candidate.status}
                color={
                  candidate.status === "Active"
                    ? "success"
                    : "default"
                }
                size="small"
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Email
              </Typography>
              <Typography>
                {candidate.email || "-"}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Phone
              </Typography>
              <Typography>
                {candidate.phone || "-"}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Total Experience
              </Typography>
              <Typography>
                {candidate.experienceYears ?? 0} years
              </Typography>
            </Grid>

            {/* ================= Resume ================= */}
            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Resume
              </Typography>

              {candidate.resumePath ? (
  <Button
    startIcon={<Description />}
    variant="outlined"
    onClick={() =>
      window.open(
        `${API_BASE_URL}/api/Candidate/${candidate.candidateID}/resume`,
        "_blank"
      )
    }
  >
    View Resume
  </Button>
) : (
  <Typography>-</Typography>
)}

            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ================= Skills ================= */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Skills
          </Typography>

          {candidate.skills && candidate.skills.length > 0 ? (
            candidate.skills.map((skill) => (
              <Chip
                key={skill.skillID}
                label={`${skill.skillName} (${skill.yearsOfExperience}y)`}
                sx={{ mr: 1, mb: 1 }}
              />
            ))
          ) : (
            <Typography>-</Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

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
  Chip,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getCandidates } from "../../api/candidates.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CandidatesList() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCandidates()
      .then((res) => {
        setCandidates(res.data.candidates); // ✅ IMPORTANT
      })
      .catch(() => toast.error("Failed to load candidates"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Candidates ({candidates.length})
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {candidates.map((c) => (
              <TableRow key={c.candidateID}>
                <TableCell>
                  {c.firstName} {c.lastName}
                </TableCell>

                <TableCell>{c.email || "-"}</TableCell>

                <TableCell>{c.phone || "-"}</TableCell>

                <TableCell>
                  {c.experienceYears ?? 0} yrs
                </TableCell>

                <TableCell>
                  {c.skills.length > 0 ? (
                    c.skills.map((s) => (
                      <Chip
                        key={`${c.candidateID}-${s.skillID}`}
                        label={`${s.skillName} (${s.yearsOfExperience}y)`}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell>
                  <Chip
                    label={c.status}
                    color={
                      c.status === "Active" ? "success" : "default"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell align="center">
                  <IconButton
                    onClick={() =>
                      navigate(
                        `/dashboard/candidates/${c.candidateID}`
                      )
                    }
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {candidates.length === 0 && (
              <TableRow key="no-candidates">
                <TableCell colSpan={7} align="center">
                  No candidates found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

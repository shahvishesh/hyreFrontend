import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getScreeningCandidates } from "../../api/screening.api";

export default function JobScreeningCandidates() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScreeningCandidates(jobId)
      .then((res) => {
        const data = res.data.data;

        setJobTitle(data.jobTitle);

        // ✅ Only candidates in Screening stage
        const screeningCandidates =
          data.linkedCandidates.filter(
            (c) => c.stage === "Screening"
          );

        setCandidates(screeningCandidates);
      })
      .catch(() =>
        toast.error(
          "Failed to load candidates for screening"
        )
      )
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Screening – {jobTitle}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {candidates.map((c) => (
              <TableRow key={c.candidateJobID}>
                <TableCell>{c.fullName}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>
                  {c.experienceYears} yrs
                </TableCell>
                <TableCell>
                  <Chip
                    label={c.stage}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate(
                        `/dashboard/screening/${jobId}/review/${c.candidateJobID}`,
  { state: { candidateId: c.candidateID } }
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
                  colSpan={5}
                  align="center"
                >
                  No candidates pending screening
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

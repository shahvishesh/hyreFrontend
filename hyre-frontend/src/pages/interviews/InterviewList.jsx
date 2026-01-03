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
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getInterviewsByTab } from "../../api/interviews.api";

export default function InterviewList({ tab }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getInterviewsByTab(tab)
      .then((res) => {
        setInterviews(res.data);
      })
      .catch(() =>
        toast.error("Failed to load interviews")
      )
      .finally(() => setLoading(false));
  }, [tab]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Candidate</TableCell>
              <TableCell>Job</TableCell>
              <TableCell>Round</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Mode</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {interviews.map((i) => (
              <TableRow key={i.candidateRoundID}>
                <TableCell>
                  {i.candidateName}
                </TableCell>

                <TableCell>
                  {i.jobTitle}
                </TableCell>

                <TableCell>
                  {i.roundName}
                </TableCell>

                <TableCell>
                  {i.isPanelRound ? "Panel" : "1:1"} •{" "}
                  {i.roundType}
                </TableCell>

                <TableCell>
                  {i.scheduledStart
                    ? new Date(
                        i.scheduledStart
                      ).toLocaleString()
                    : "-"}
                </TableCell>

                <TableCell>
                  {i.interviewMode || "-"}
                </TableCell>

                <TableCell>
                  <Chip
                    label={i.status}
                    size="small"
                    color={
                      i.status === "Live"
                        ? "success"
                        : i.status === "Completed"
                        ? "default"
                        : "warning"
                    }
                  />
                </TableCell>
              </TableRow>
            ))}

            {interviews.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    No interviews found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
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

const TABS = ["Pending", "Completed"];

export default function FeedbackCandidateRounds() {
  const navigate = useNavigate();
  const { jobId, candidateId } = useParams();

  const [activeTab, setActiveTab] = useState("Pending");
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Load rounds ================= */
  useEffect(() => {
    setLoading(true);

    const endpoint =
      activeTab === "Pending"
        ? `/api/InterviewFeedback/job/${jobId}/candidate/${candidateId}/pending`
        : `/api/InterviewFeedback/job/${jobId}/candidate/${candidateId}/completed`;

    axiosInstance
      .get(endpoint)
      .then((res) => {
        setRounds(res.data || []);
      })
      .catch(() =>
        toast.error(`Failed to load ${activeTab} feedback`)
      )
      .finally(() => setLoading(false));
  }, [activeTab, jobId, candidateId]);

  return (
    <Box>
      {/* ================= Header ================= */}
      <Box display="flex" alignItems="center" mb={2}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <Typography variant="h6" ml={2}>
          Candidate Interview Rounds
        </Typography>
      </Box>

      {/* ================= Tabs ================= */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 3 }}
      >
        {TABS.map((tab) => (
          <Tab key={tab} label={tab} value={tab} />
        ))}
      </Tabs>

      {/* ================= Content ================= */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Round Name</TableCell>
                <TableCell>Round Type</TableCell>
                <TableCell>Interview Date</TableCell>
                <TableCell align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rounds.map((r) => (
                <TableRow key={r.candidateRoundID}>
                  <TableCell>{r.roundName}</TableCell>
                  <TableCell>{r.roundType}</TableCell>
                  <TableCell>
                    {new Date(
                      r.interviewDate
                    ).toLocaleDateString()}
                  </TableCell>

                  <TableCell align="center">
                    {activeTab === "Pending" ? (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() =>
                          navigate(
                            `/dashboard/feedback/review/${r.candidateRoundID}`
                          )
                        }
                      >
                        Give Feedback
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          navigate(
                            `/dashboard/feedback/view/${r.candidateRoundID}`
                          )
                        }
                      >
                        View Feedback
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {rounds.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                  >
                    No {activeTab.toLowerCase()} rounds
                    found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

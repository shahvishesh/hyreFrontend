import {
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

const TABS = [
  { label: "Pending Decision", key: "pending" },
  { label: "Reschedule", key: "reschedule" },
  { label: "Completed Decision", key: "completed" },
];

export default function RecruiterCandidateRounds() {
  const { jobId, candidateId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("pending");
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Load rounds based on tab ================= */
  useEffect(() => {
    setLoading(true);

    let url = "";

    if (activeTab === "pending") {
      url = `/api/RecruiterInterviewFeedback/job/${jobId}/candidate/${candidateId}?decisionState=Pending`;
    } else if (activeTab === "reschedule") {
      url = `/api/RecruiterDecision/job/${jobId}/candidate/${candidateId}/reschedule`;
    } else {
      url = `/api/RecruiterInterviewFeedback/job/${jobId}/candidate/${candidateId}?decisionState=Decided`;
    }

    axiosInstance
      .get(url)
      .then((res) => setRounds(res.data))
      .catch(() =>
        toast.error("Failed to load candidate rounds")
      )
      .finally(() => setLoading(false));
  }, [activeTab, jobId, candidateId]);

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Candidate Rounds
      </Typography>

      {/* ================= Tabs ================= */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 2 }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.key}
            label={tab.label}
            value={tab.key}
          />
        ))}
      </Tabs>

      {/* ================= Table ================= */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Round</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Interview Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rounds.map((round) => (
                <TableRow key={round.candidateRoundID}>
                  <TableCell>{round.roundName}</TableCell>
                  <TableCell>{round.roundType}</TableCell>
                  <TableCell>
                    {new Date(round.interviewDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{round.status}</TableCell>

                  <TableCell align="center">
                    {activeTab === "pending" && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          navigate(
                            /* `/dashboard/recruiter-feedback/round/${round.candidateRoundID}/decision` */
                            `/dashboard/recruiter-decisions/${jobId}/candidate/${candidateId}/round/${round.candidateRoundID}/decision`
                          )
                        }
                      >
                        Make Decision
                      </Button>
                    )}

                    {activeTab === "reschedule" && (
                      <Button
                        variant="outlined"
                        size="small"
                        disabled
                      >
                        Reschedule
                      </Button>
                    )}

                    {activeTab === "completed" && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          navigate(
                            `/dashboard/recruiter-feedback/round/${round.candidateRoundID}/decision`
                          )
                        }
                      >
                        View Decision
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {rounds.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No rounds found
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

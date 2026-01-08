import {
  Box,
  Button,
  Chip,
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

export default function RecruiterScreeningCandidatesList() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Pending");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Load candidates ================= */
  useEffect(() => {
    setLoading(true);

    const status = activeTab.toLowerCase();
    axiosInstance
      .get(`/api/CandidateReview/job/${jobId}/candidates?status=${status}`)
      .then((res) => {
        setCandidates(res.data || []);
      })
      .catch(() =>
        toast.error(`Failed to load ${activeTab} candidates`)
      )
      .finally(() => setLoading(false));
  }, [activeTab, jobId]);

  return (
    <Box>
      {/* ================= Header ================= */}
      <Box display="flex" alignItems="center" mb={2}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/dashboard/recruiter-screening")}
        >
          Back to Jobs
        </Button>

        <Typography variant="h6" ml={2}>
          Screening Candidates
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
          <Table>
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
                    {activeTab === "Pending" ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          navigate(
                            `/dashboard/recruiter-screening/${jobId}/candidate/${c.candidateID}/make-decision`
                          )
                        }
                      >
                        Make Decision
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          navigate(
                            `/dashboard/recruiter-screening/${jobId}/candidate/${c.candidateID}/view-decision`
                          )
                        }
                      >
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {candidates.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                  >
                    No {activeTab.toLowerCase()} candidates found
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

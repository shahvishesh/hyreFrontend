import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobById } from "../../api/jobs.api";
import { toast } from "react-toastify";
import { getCandidates } from "../../api/candidates.api";
import { linkCandidateToJob } from "../../api/candidateJobs.api";
import { getCandidateMatches } from "../../api/candidateMatching.api";

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState("");
    const [linking, setLinking] = useState(false);

    const [matches, setMatches] = useState([]);
const [loadingMatches, setLoadingMatches] = useState(true);


useEffect(() => {
  getCandidates()
    .then((res) => {
      setCandidates(res.data.candidates);
    })
    .catch(() =>
      toast.error("Failed to load candidates")
    );
}, []);


  useEffect(() => {
    getJobById(jobId)
      .then((res) => {
        setJob(res.data);
      })
      .catch(() => toast.error("Failed to load job details"))
      .finally(() => setLoading(false));
  }, [jobId]);

  useEffect(() => {
  getCandidateMatches(jobId)
    .then((res) => {
      setMatches(res.data.matches);
    })
    .catch(() =>
      toast.error("Failed to load candidate matches")
    )
    .finally(() => setLoadingMatches(false));
}, [jobId]);

const handleLinkCandidate = async (candidateID) => {
  try {
    await linkCandidateToJob(jobId, candidateID);

    setMatches((prev) =>
      prev.filter((m) => m.candidateID !== candidateID)
    );

    toast.success("Candidate linked successfully");
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        "Failed to link candidate"
    );
  }
};




  if (loading) {
    return <CircularProgress />;
  }

  if (!job) {
    return <Typography>No job found</Typography>;
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/dashboard/jobs/list")}
        >
          Back
        </Button>

        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() =>
            navigate(`/dashboard/jobs/edit/${job.jobID}`)
          }
        >
          Edit Job
        </Button>
      </Box>

      {/* Job Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5">{job.title}</Typography>
          <Typography color="text.secondary" mb={2}>
            {job.companyName} • {job.location}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>
                <strong>Experience:</strong>{" "}
                {job.minExperience} - {job.maxExperience} years
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>
                <strong>Job Type:</strong> {job.jobType}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>
                <strong>Workplace:</strong> {job.workplaceType}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">Description</Typography>
          <Typography>{job.description}</Typography>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Skills
          </Typography>

          {job.skills?.map((skill, index) => (
            <Chip
              key={`${skill.skillID}-${index}`}
              label={`${skill.skillName ?? ""} (${skill.skillType})`}
              color={skill.skillType === "Required" ? "primary" : "default"}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}

          {job.skills?.length === 0 && (
            <Typography>No skills added</Typography>
          )}
        </CardContent>
      </Card>

      {/* ================= Candidate Matches ================= */}
<Card sx={{ mb: 3 }}>
  <CardContent>
    <Typography variant="h6" mb={2}>
      Candidate Matches
    </Typography>

    {loadingMatches ? (
      <CircularProgress />
    ) : (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Match %</TableCell>
              <TableCell>Matched Skills</TableCell>
              <TableCell>Missing Skills</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {matches.map((m) => (
              <TableRow key={m.candidateID}>
                <TableCell>{m.fullName}</TableCell>
                <TableCell>{m.email}</TableCell>
                <TableCell>
                  {m.totalExperience} yrs
                </TableCell>

                <TableCell>
                  <Chip
                    label={`${m.matchScore}%`}
                    color={
                      m.matchScore >= 70
                        ? "success"
                        : m.matchScore >= 40
                        ? "warning"
                        : "default"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  {m.matchedRequiredSkills
                    .concat(m.matchedPreferredSkills)
                    .map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                </TableCell>

                <TableCell>
                  {m.missingRequiredSkills
                    .concat(m.missingPreferredSkills)
                    .map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        size="small"
                        color="error"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                </TableCell>

                <TableCell align="center">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() =>
                      handleLinkCandidate(m.candidateID)
                    }
                  >
                    Link
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {matches.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                >
                  No matching candidates found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </CardContent>
</Card>



      {/* Interview Rounds */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Interview Rounds
          </Typography>

          {job.interviewRounds?.map((round, index) => (
            <Box key={`${round.sequenceNo}-${index}`} mb={2}>
              <Typography>
                <strong>
                  Round {round.sequenceNo}: {round.roundName}
                </strong>
              </Typography>
              <Typography color="text.secondary">
                {round.roundType} • {round.interviewMode} •{" "}
                {round.durationMinutes} mins
              </Typography>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}

          {job.interviewRounds?.length === 0 && (
            <Typography>No interview rounds defined</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

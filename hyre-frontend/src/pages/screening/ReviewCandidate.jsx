import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
    Chip,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSkills } from "../../api/skills.api";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { useLocation } from "react-router-dom";
import { getCandidateById } from "../../api/candidates.api";


export default function ReviewCandidate() {
  const { candidateJobId, jobId } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
const candidateId = location.state?.candidateId;

const [candidate, setCandidate] = useState(null);

  const [skills, setSkills] = useState([]);
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({
    decision: false,
    comment: false,
    skills: {},
  });

  useEffect(() => {
  if (!candidateId) {
    toast.error("Candidate information missing");
    return;
  }

  getCandidateById(candidateId)
    .then((res) => {
      setCandidate(res.data.candidate);
    })
    .catch(() =>
      toast.error("Failed to load candidate details")
    );
}, [candidateId]);


  /* ================= Load skills ================= */
  useEffect(() => {
    getSkills()
      .then((res) => {
        // initialize skill review state
        const initialized = res.data.map((s) => ({
          skillId: s.skillID,
          skillName: s.skillName,
          isVerified: false,
          verifiedYearsOfExperience: "",
        }));
        setSkills(initialized);
      })
      .catch(() => toast.error("Failed to load skills"))
      .finally(() => setLoading(false));
  }, []);

  /* ================= Validation ================= */
  const validateForm = () => {
    const newErrors = {
      decision: !decision,
      comment: !comment.trim(),
      skills: {},
    };

    // Validate verified skills have years of experience
    skills.forEach((skill, index) => {
      if (skill.isVerified && (!skill.verifiedYearsOfExperience || skill.verifiedYearsOfExperience <= 0)) {
        newErrors.skills[index] = true;
      }
    });

    setErrors(newErrors);

    // Check if there are any errors
    const hasSkillErrors = Object.keys(newErrors.skills).length > 0;
    return !newErrors.decision && !newErrors.comment && !hasSkillErrors;
  };

  /* ================= Save Review ================= */
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      setSaving(true);

      const payload = {
        candidateJobID: Number(candidateJobId),
        comment,
        decision,
        skills: skills.map((s) => ({
          skillId: s.skillId,
          isVerified: s.isVerified,
          verifiedYearsOfExperience: s.isVerified
            ? Number(s.verifiedYearsOfExperience)
            : null,
        })),
      };

      await axiosInstance.post(
        "/api/CandidateReview/create",
        payload
      );

      toast.success("Review saved successfully");
      navigate(`/dashboard/screening/${jobId}`, { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to save review"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      {/* Back */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Typography variant="h5" mb={3}>
        Review Candidate
      </Typography>

      {/* ================= Candidate Details ================= */}
{candidate && (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" mb={2}>
        Candidate Details
      </Typography>

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
          <Typography>{candidate.status}</Typography>
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

        {/* Resume */}
        <Grid item xs={6}>
          <Typography variant="subtitle2">
            Resume
          </Typography>

          {candidate.resumePath ? (
            <Button
              variant="outlined"
              onClick={() =>
                window.open(
                  `${import.meta.env.VITE_API_BASE_URL}/api/Candidate/${candidate.candidateID}/resume`,
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
)}

{/* ================= Candidate Claimed Skills ================= */}
{candidate && (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" mb={1}>
        Claimed Skills (as provided by candidate)
      </Typography>

      {candidate.skills && candidate.skills.length > 0 ? (
        candidate.skills.map((skill) => (
          <Chip
            key={skill.skillID}
            label={`${skill.skillName} (${skill.yearsOfExperience} yrs)`}
            sx={{ mr: 1, mb: 1 }}
          />
        ))
      ) : (
        <Typography color="text.secondary">
          No skills claimed by candidate
        </Typography>
      )}
    </CardContent>
  </Card>
)}


      {/* ================= Skills ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Skill Verification
          </Typography>

          {skills.map((skill, index) => (
            <Grid
              container
              spacing={2}
              alignItems="center"
              key={skill.skillId}
              sx={{ mb: 1 }}
            >
              <Grid item xs={4}>
                <Checkbox
                  checked={skill.isVerified}
                  onChange={(e) => {
                    const copy = [...skills];
                    copy[index].isVerified =
                      e.target.checked;
                    if (!e.target.checked) {
                      copy[index].verifiedYearsOfExperience =
                        "";
                    }
                    setSkills(copy);
                  }}
                />
                {skill.skillName}
              </Grid>

              <Grid item xs={4}>
                <TextField
                  type="number"
                  label="Verified Years"
                  size="small"
                  disabled={!skill.isVerified}
                  value={
                    skill.verifiedYearsOfExperience
                  }
                  onChange={(e) => {
                    const copy = [...skills];
                    copy[index].verifiedYearsOfExperience =
                      e.target.value;
                    setSkills(copy);
                    // Clear error for this skill
                    const newErrors = { ...errors };
                    delete newErrors.skills[index];
                    setErrors(newErrors);
                  }}
                  error={errors.skills[index]}
                  helperText={
                    errors.skills[index]
                      ? "Years required for verified skill"
                      : ""
                  }
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          ))}
        </CardContent>
      </Card>

      {/* ================= Decision ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Decision
          </Typography>

          <FormControl fullWidth required error={errors.decision}>
            <InputLabel>Select Decision</InputLabel>
            <Select
              value={decision}
              label="Select Decision"
              onChange={(e) => {
                setDecision(e.target.value);
                setErrors({ ...errors, decision: false });
              }}
            >
              <MenuItem value="Shortlist">Shortlist</MenuItem>
              <MenuItem value="Reject">Reject</MenuItem>
            </Select>
            {errors.decision && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                Decision is required
              </Typography>
            )}
          </FormControl>
        </CardContent>
      </Card>

      {/* ================= Comment ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Reviewer Comment
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            required
            label="Comment"
            placeholder="Enter your review comments"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setErrors({ ...errors, comment: false });
            }}
            error={errors.comment}
            helperText={errors.comment ? "Comment is required" : ""}
          />
        </CardContent>
      </Card>

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Review"}
      </Button>
    </Box>
  );
}

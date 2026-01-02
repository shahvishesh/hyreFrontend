import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Save, ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { getJobById, updateJob } from "../../api/jobs.api";
import { getSkills } from "../../api/skills.api";
import { toast } from "react-toastify";

export default function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [availableSkills, setAvailableSkills] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      minExperience: "",
      maxExperience: "",
      companyName: "",
      location: "",
      jobType: "",
      workplaceType: "",
      status: "",
      closedReason: "",
      selectedCandidateID: "",
      skills: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const watchedSkills = watch("skills");
  const status = watch("status");

  /* ================= Load job + skills ================= */
  useEffect(() => {
    Promise.all([getJobById(jobId), getSkills()])
      .then(([jobRes, skillsRes]) => {
        const job = jobRes.data;

        reset({
          title: job.title ?? "",
          description: job.description ?? "",
          minExperience: job.minExperience ?? "",
          maxExperience: job.maxExperience ?? "",
          companyName: job.companyName ?? "",
          location: job.location ?? "",
          jobType: job.jobType ?? "",
          workplaceType: job.workplaceType ?? "",
          status: job.status ?? "",
          closedReason: job.closedReason ?? "",
          selectedCandidateID: job.selectedCandidateID ?? "",
          skills:
            job.skills?.map((s) => ({
              skillID: s.skillID,
              skillType: s.skillType,
            })) ?? [],
        });

        setAvailableSkills(skillsRes.data);
      })
      .catch(() => toast.error("Failed to load job"))
      .finally(() => setLoading(false));
  }, [jobId, reset]);

  /* ================= Submit ================= */
  const onSubmit = async (data) => {
    try {
      const payload = {
        Title: data.title || null,
        Description: data.description || null,
        MinExperience: data.minExperience
          ? Number(data.minExperience)
          : null,
        MaxExperience: data.maxExperience
          ? Number(data.maxExperience)
          : null,
        CompanyName: data.companyName || null,
        Location: data.location || null,
        JobType: data.jobType || null,
        WorkplaceType: data.workplaceType || null,
        Status: data.status || null,
        ClosedReason:
          data.status === "Closed" ? data.closedReason : null,
        SelectedCandidateID: data.selectedCandidateID
          ? Number(data.selectedCandidateID)
          : null,
        Skills:
          data.skills && data.skills.length > 0
            ? data.skills
            : null,
      };

      await updateJob(jobId, payload);
      toast.success("Job updated successfully");
      navigate(`/dashboard/jobs/${jobId}`);
    } catch {
      toast.error("Failed to update job");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="lg">
      <Box mb={2}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>

      <Typography variant="h5" mb={3}>
        Edit Job
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ================= Job Info ================= */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Job Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="Job Title" {...register("title")} />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  {...register("companyName")}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  {...register("description")}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Experience"
                  {...register("minExperience")}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Experience"
                  {...register("maxExperience")}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField fullWidth label="Location" {...register("location")} />
              </Grid>

              <Grid item xs={6}>
                <TextField fullWidth label="Job Type" {...register("jobType")} />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Workplace Type"
                  {...register("workplaceType")}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Selected Candidate ID"
                  {...register("selectedCandidateID")}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ================= Status ================= */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Job Status
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                    select
                    fullWidth
                    label="Status"
                    value={status ?? ""}
                    {...register("status")}
                    >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                    </TextField>

              </Grid>

              {status === "Closed" && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Closed Reason"
                    {...register("closedReason", {
                      required: "Reason is required when closing",
                    })}
                    error={!!errors.closedReason}
                    helperText={errors.closedReason?.message}
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* ================= Skills ================= */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={1}>
              Skills
            </Typography>

            {fields.map((item, index) => (
              <Grid
                container
                spacing={2}
                alignItems="center"
                key={item.id}
                sx={{ mb: 1 }}
              >
                <Grid item xs={5}>
                  <TextField
                    select
                    fullWidth
                    label="Skill"
                    value={watchedSkills?.[index]?.skillID ?? ""}
                    {...register(`skills.${index}.skillID`)}
                  >
                    <MenuItem value="">Select Skill</MenuItem>
                    {availableSkills.map((skill) => (
                      <MenuItem key={skill.skillID} value={skill.skillID}>
                        {skill.skillName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    select
                    fullWidth
                    label="Skill Type"
                    value={watchedSkills?.[index]?.skillType ?? "Required"}
                    {...register(`skills.${index}.skillType`)}
                  >
                    <MenuItem value="Required">Required</MenuItem>
                    <MenuItem value="Preferred">Preferred</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={2}>
                  <Button color="error" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}

            <Button
              onClick={() =>
                append({ skillID: "", skillType: "Required" })
              }
            >
              Add Skill
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" variant="contained" startIcon={<Save />}>
          Save Changes
        </Button>
      </form>
    </Container>
  );
}

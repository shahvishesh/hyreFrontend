import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  IconButton,
  Divider,
  MenuItem,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useForm, useFieldArray } from "react-hook-form";
import { createJob } from "../../api/jobs.api";
import { getSkills } from "../../api/skills.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CreateJob() {
  const navigate = useNavigate();
  const [availableSkills, setAvailableSkills] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      companyName: "",
      location: "",
      jobType: "",
      workplaceType: "",
      minExperience: 0,
      maxExperience: 0,
      skills: [{ skillID: "", skillType: "" }],
      interviewRounds: [
        {
          sequenceNo: 1,
          roundName: "",
          roundType: "",
          durationMinutes: 30,
          interviewMode: "",
          isPanelRound: false,
        },
      ],
    },
  });

  const {
    fields: skillFields,
    append: addSkill,
    remove: removeSkill,
  } = useFieldArray({ control, name: "skills" });

  const {
    fields: roundFields,
    append: addRound,
    remove: removeRound,
  } = useFieldArray({ control, name: "interviewRounds" });

  /* ================= Load Skills ================= */
  useEffect(() => {
    getSkills()
      .then((res) => setAvailableSkills(res.data))
      .catch(() => toast.error("Failed to load skills"));
  }, []);

  
  /* ================= Submit ================= */
  const onSubmit = async (data) => {
    try {
      await createJob(data);
      toast.success("Job created successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create job");
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" mb={3}>
        Create Job
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ================= Job Details ================= */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Job Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  {...register("title", { required: "Job title is required" })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  {...register("companyName", {
                    required: "Company name is required",
                  })}
                  error={!!errors.companyName}
                  helperText={errors.companyName?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  {...register("description", {
                    required: "Description is required",
                  })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Min Experience"
                  type="number"
                  {...register("minExperience", {
                    required: "Min experience is required",
                    min: { value: 0, message: "Cannot be negative" },
                  })}
                  error={!!errors.minExperience}
                  helperText={errors.minExperience?.message}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Max Experience"
                  type="number"
                  {...register("maxExperience", {
                    required: "Max experience is required",
                    validate: (value) =>
                      value >= watch("minExperience") ||
                      "Max must be ≥ Min experience",
                  })}
                  error={!!errors.maxExperience}
                  helperText={errors.maxExperience?.message}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Location"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  error={!!errors.location}
                  helperText={errors.location?.message}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Job Type"
                  {...register("jobType", {
                    required: "Job type is required",
                  })}
                  error={!!errors.jobType}
                  helperText={errors.jobType?.message}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Workplace Type"
                  {...register("workplaceType", {
                    required: "Workplace type is required",
                  })}
                  error={!!errors.workplaceType}
                  helperText={errors.workplaceType?.message}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ================= Skills (FIXED) ================= */}
<Card sx={{ mb: 3 }}>
  <CardContent>
    <Typography variant="h6" mb={1}>
      Skills
    </Typography>

    {skillFields.map((item, index) => (
      <Grid
        container
        spacing={2}
        alignItems="center"
        key={item.id}
        sx={{ mb: 1 }}
      >
        {/* Skill */}
        <Grid item xs={5}>
          <TextField
            select
            fullWidth
            label="Skill"
            {...register(`skills.${index}.skillID`, {
              required: "Skill is required",
            })}
            error={!!errors.skills?.[index]?.skillID}
            helperText={errors.skills?.[index]?.skillID?.message}
          >
            <MenuItem value="">Select Skill</MenuItem>
            {availableSkills.map((skill) => (
              <MenuItem
                key={skill.skillID}
                value={skill.skillID}
              >
                {skill.skillName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Skill Type */}
        <Grid item xs={5}>
          <TextField
            select
            fullWidth
            label="Skill Type"
            {...register(`skills.${index}.skillType`, {
              required: "Skill type is required",
            })}
            error={!!errors.skills?.[index]?.skillType}
            helperText={errors.skills?.[index]?.skillType?.message}
          >
            <MenuItem value="">Select Type</MenuItem>
            <MenuItem value="Required">Required</MenuItem>
            <MenuItem value="Preferred">Preferred</MenuItem>
          </TextField>
        </Grid>

        {/* Remove */}
        <Grid item xs={2}>
          <IconButton
            disabled={skillFields.length === 1}
            onClick={() => removeSkill(index)}
          >
            <Delete />
          </IconButton>
        </Grid>
      </Grid>
    ))}

    <Button
      startIcon={<Add />}
      onClick={() =>
        addSkill({ skillID: "", skillType: "Required" })
      }
    >
      Add Skill
    </Button>
  </CardContent>
</Card>


        {/* ================= Interview Rounds ================= */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={1}>
              Interview Rounds
            </Typography>

            {roundFields.map((item, index) => (
              <Box key={item.id} mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Sequence No"
                      type="number"
                      fullWidth
                      {...register(
                        `interviewRounds.${index}.sequenceNo`,
                        {
                          required: "Sequence is required",
                          min: { value: 1, message: "Must be ≥ 1" },
                        }
                      )}
                      error={
                        !!errors.interviewRounds?.[index]?.sequenceNo
                      }
                      helperText={
                        errors.interviewRounds?.[index]?.sequenceNo
                          ?.message
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Round Name"
                      fullWidth
                      {...register(
                        `interviewRounds.${index}.roundName`,
                        {
                          required: "Round name is required",
                        }
                      )}
                      error={
                        !!errors.interviewRounds?.[index]?.roundName
                      }
                      helperText={
                        errors.interviewRounds?.[index]?.roundName
                          ?.message
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Round Type"
                      fullWidth
                      {...register(
                        `interviewRounds.${index}.roundType`,
                        {
                          required: "Round type is required",
                        }
                      )}
                      error={
                        !!errors.interviewRounds?.[index]?.roundType
                      }
                      helperText={
                        errors.interviewRounds?.[index]?.roundType
                          ?.message
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Duration (mins)"
                      type="number"
                      fullWidth
                      {...register(
                        `interviewRounds.${index}.durationMinutes`,
                        {
                          required: "Duration is required",
                          min: {
                            value: 1,
                            message: "Must be at least 1 minute",
                          },
                        }
                      )}
                      error={
                        !!errors.interviewRounds?.[index]
                          ?.durationMinutes
                      }
                      helperText={
                        errors.interviewRounds?.[index]
                          ?.durationMinutes?.message
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Interview Mode"
                      fullWidth
                      {...register(
                        `interviewRounds.${index}.interviewMode`,
                        {
                          required: "Interview mode is required",
                        }
                      )}
                      error={
                        !!errors.interviewRounds?.[index]?.interviewMode
                      }
                      helperText={
                        errors.interviewRounds?.[index]?.interviewMode
                          ?.message
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      color="error"
                      startIcon={<Delete />}
                      disabled={roundFields.length === 1}
                      onClick={() => removeRound(index)}
                    >
                      Remove Round
                    </Button>
                  </Grid>
                </Grid>

                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}

            <Button
              startIcon={<Add />}
              onClick={() =>
                addRound({
                  sequenceNo: roundFields.length + 1,
                  roundName: "",
                  roundType: "",
                  durationMinutes: 30,
                  interviewMode: "",
                  isPanelRound: false,
                })
              }
            >
              Add Interview Round
            </Button>
          </CardContent>
        </Card>

        <Button variant="contained" type="submit">
          Create Job
        </Button>
      </form>
    </Container>
  );
}

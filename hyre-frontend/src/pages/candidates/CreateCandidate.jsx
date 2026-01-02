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
  IconButton,
} from "@mui/material";
import { Add, Delete, UploadFile } from "@mui/icons-material";
import { useForm, useFieldArray } from "react-hook-form";
import { createCandidate } from "../../api/candidates.api";
import { getSkills } from "../../api/skills.api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreateCandidate() {
  const navigate = useNavigate();
  const [availableSkills, setAvailableSkills] = useState([]);
  const [resumeFile, setResumeFile] = useState(null); // ✅ NEW

  const {
    register,
    handleSubmit,
    control,
    watch,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      experienceYears: "",
      skills: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const watchedSkills = watch("skills");

  /* ================= Load skills ================= */
  useEffect(() => {
    getSkills()
      .then((res) => setAvailableSkills(res.data))
      .catch(() => toast.error("Failed to load skills"));
  }, []);

  /* ================= File handler ================= */
  const handleResumeChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  /* ================= Submit ================= */
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("FirstName", data.firstName);
      formData.append("LastName", data.lastName || "");
      formData.append("Email", data.email || "");
      formData.append("Phone", data.phone || "");
      formData.append("ExperienceYears", data.experienceYears || "");

      data.skills?.forEach((skill, index) => {
        formData.append(`Skills[${index}].SkillID`, skill.skillID);
        if (skill.yearsOfExperience !== "") {
          formData.append(
            `Skills[${index}].YearsOfExperience`,
            skill.yearsOfExperience
          );
        }
      });

      // ✅ Resume upload (fixed)
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      await createCandidate(formData);
      toast.success("Candidate created successfully");
      navigate("/dashboard/candidates");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create candidate"
      );
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" mb={3}>
        Create Candidate
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ================= Basic Info ================= */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Candidate Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  {...register("firstName", { required: true })}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  {...register("lastName")}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  {...register("email")}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  {...register("phone")}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Experience (years)"
                  {...register("experienceYears")}
                />
              </Grid>

              <Grid item xs={6}>
  {!resumeFile ? (
    <Button
      component="label"
      startIcon={<UploadFile />}
      variant="outlined"
    >
      Upload Resume
      <input
        type="file"
        hidden
        onChange={handleResumeChange}
      />
    </Button>
  ) : (
    <Box>
      <Typography variant="body2">
        Selected: <strong>{resumeFile.name}</strong>
      </Typography>

      <Box mt={1} display="flex" gap={1}>
        <Button
          component="label"
          size="small"
          variant="outlined"
        >
          Change
          <input
            type="file"
            hidden
            onChange={handleResumeChange}
          />
        </Button>

        <Button
          size="small"
          color="error"
          onClick={() => setResumeFile(null)}
        >
          Remove
        </Button>
      </Box>
    </Box>
  )}
</Grid>

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
                      <MenuItem
                        key={skill.skillID}
                        value={skill.skillID}
                      >
                        {skill.skillName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Years of Experience"
                    {...register(
                      `skills.${index}.yearsOfExperience`
                    )}
                  />
                </Grid>

                <Grid item xs={2}>
                  <IconButton
                    color="error"
                    onClick={() => remove(index)}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Button
              startIcon={<Add />}
              onClick={() =>
                append({
                  skillID: "",
                  yearsOfExperience: "",
                })
              }
            >
              Add Skill
            </Button>
          </CardContent>
        </Card>

        <Button variant="contained" type="submit">
          Create Candidate
        </Button>
      </form>
    </Container>
  );
}

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Delete, ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getJobById } from "../../api/jobs.api";

/* ================= ROLES ================= */
const INTERVIEW_ROLES = ["Technical", "HR", "Managerial"];

export default function ModifyInterviewers() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [jobDetails, setJobDetails] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [interviewRoles, setInterviewRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [filterRole, setFilterRole] = useState("All");
  const [search, setSearch] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!jobId || isNaN(Number(jobId))) {
      setError("Invalid job ID");
      setLoading(false);
      return;
    }

    Promise.all([
      getJobById(jobId),
      axiosInstance.get(
        "/api/JobInterviewer/employees?role=Interviewer"
      ),
      axiosInstance.get(
        "/api/JobInterviewer/employees?role=Hr"
      ),
      axiosInstance.get(
        `/api/JobInterviewer/${jobId}/assigned-interviewers`
      ),
    ])
      .then(([jobRes, intRes, hrRes, assignedRes]) => {
        setJobDetails(jobRes.data);
        
        const employees = [
          ...intRes.data,
          ...hrRes.data,
        ];
        setAllEmployees(employees);

        // Pre-populate selected interviewers
        const assignedInterviewers = assignedRes.data.interviewers || [];
        const preSelectedIds = new Set(
          assignedInterviewers.map(int => int.interviewerID)
        );
        const preSelectedRoles = assignedInterviewers.reduce((acc, int) => {
          acc[int.interviewerID] = int.interviewRole;
          return acc;
        }, {});

        setSelectedIds(preSelectedIds);
        setInterviewRoles(preSelectedRoles);
        setError(null);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Failed to load data";
        setError(errorMsg);
        toast.error(errorMsg);
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  /* ================= DERIVED STATE ================= */
  const availableEmployees = allEmployees.filter(
    (emp) => !selectedIds.has(emp.userId)
  );

  const selectedEmployees = allEmployees.filter(
    (emp) => selectedIds.has(emp.userId)
  );

  /* ================= FILTER ================= */
  const filteredEmployees = availableEmployees.filter((e) => {
    const roleMatch =
      filterRole === "All" ||
      (e.systemRoles && e.systemRoles.some(role => 
        role.toLowerCase() === filterRole.toLowerCase()
      ));

    const searchMatch =
      e.fullName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      e.email
        .toLowerCase()
        .includes(search.toLowerCase());

    return roleMatch && searchMatch;
  });

  /* ================= MOVE DOWN ================= */
  const handleSelect = (emp) => {
    setSelectedIds((prev) => new Set(prev).add(emp.userId));
    setInterviewRoles((prev) => ({
      ...prev,
      [emp.userId]: "",
    }));
  };

  /* ================= MOVE UP ================= */
  const handleRemove = (emp) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(emp.userId);
      return newSet;
    });
    
    setInterviewRoles((prev) => {
      const newRoles = { ...prev };
      delete newRoles[emp.userId];
      return newRoles;
    });
  };

  /* ================= ROLE CHANGE ================= */
  const handleRoleChange = (id, value) => {
    setInterviewRoles((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (selectedIds.size === 0) {
      toast.error("Select at least one interviewer");
      return;
    }

    const hasUnassignedRoles = selectedEmployees.some(
      (emp) => !interviewRoles[emp.userId]
    );

    if (hasUnassignedRoles) {
      toast.error("Assign role to all interviewers");
      return;
    }

    const payload = {
      jobID: Number(jobId),
      assignments: selectedEmployees.map((emp) => ({
        interviewerID: emp.userId,
        interviewRole: interviewRoles[emp.userId],
      })),
    };

    try {
      setSaving(true);
      await axiosInstance.post(
        "/api/JobInterviewer/assign-v2",
        payload
      );

      toast.success("Interviewer assignments updated successfully");
      navigate(-1);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* ================= HEADER & JOB DETAILS ================= */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Typography variant="h5" mb={3}>
        Modify Interviewer Assignments
      </Typography>

      {jobDetails && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Job Details
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Typography>
                  <strong>Title:</strong> {jobDetails.title}
                </Typography>
                <Typography>
                  <strong>Company:</strong> {jobDetails.companyName}
                </Typography>
                <Typography>
                  <strong>Location:</strong> {jobDetails.location || "N/A"}
                </Typography>
              </Box>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Typography>
                  <strong>Experience:</strong> {jobDetails.minExperience} - {jobDetails.maxExperience} yrs
                </Typography>
                <Typography>
                  <strong>Type:</strong> {jobDetails.jobType}
                </Typography>
                <Typography>
                  <strong>Workplace:</strong> {jobDetails.workplaceType}
                </Typography>
                <Chip label={jobDetails.status} color="primary" size="small" />
              </Box>
              {jobDetails.skills && jobDetails.skills.length > 0 && (
                <Box>
                  <Typography component="span">
                    <strong>Skills:</strong>{" "}
                  </Typography>
                  {jobDetails.skills.map((skill, idx) => (
                    <Chip
                      key={skill.skillID || idx}
                      label={skill.skillName}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ================= FILTERS ================= */}
      <Box
        display="flex"
        gap={2}
        mb={2}
      >
        <TextField
          select
          label="Filter Role"
          size="small"
          value={filterRole}
          onChange={(e) =>
            setFilterRole(e.target.value)
          }
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Interviewer">
            Interviewer
          </MenuItem>
          <MenuItem value="Hr">HR</MenuItem>
        </TextField>

        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </Box>

      {/* ================= AVAILABLE ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Available Employees
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>System Role</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.userId}>
                  <TableCell>
                    <Checkbox
                      onChange={() =>
                        handleSelect(emp)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {emp.fullName}
                  </TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>
                    {emp.designation || "-"}
                  </TableCell>
                  <TableCell>
                    {emp.systemRoles ? emp.systemRoles.join(", ") : "-"}
                  </TableCell>
                </TableRow>
              ))}

              {filteredEmployees.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                  >
                    No employees
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================= SELECTED ================= */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Assigned Interviewers
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>System Role</TableCell>
                <TableCell>Interviewer Role</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {selectedEmployees.map((emp) => (
                <TableRow key={emp.userId}>
                  <TableCell>
                    {emp.fullName}
                  </TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>
                    {emp.designation || "-"}
                  </TableCell>
                  <TableCell>
                    {emp.systemRoles ? emp.systemRoles.join(", ") : "-"}
                  </TableCell>

                  <TableCell>
                    <TextField
                      select
                      size="small"
                      placeholder="Select Role"
                      value={
                        interviewRoles[emp.userId] || ""
                      }
                      onChange={(e) =>
                        handleRoleChange(
                          emp.userId,
                          e.target.value
                        )
                      }
                      SelectProps={{
                        displayEmpty: true,
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em>Select Role</em>
                      </MenuItem>
                      {INTERVIEW_ROLES.map(
                        (r) => (
                          <MenuItem
                            key={r}
                            value={r}
                          >
                            {r}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleRemove(emp)
                      }
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {selectedEmployees.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                  >
                    No interviewers assigned
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================= SUBMIT ================= */}
      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving || selectedIds.size === 0}
        >
          {saving ? "Updating..." : "Update Assignments"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          disabled={saving}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

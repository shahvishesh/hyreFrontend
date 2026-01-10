import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
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
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axiosInstance from "../../api/axiosInstance";

/* ================= ROLES ================= */
const INTERVIEW_ROLES = [
  "Technical",
  "HR",
  "Managerial",
];

export default function AssignInterviewers() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD EMPLOYEES ================= */
  useEffect(() => {
    axiosInstance
      .get("/api/JobInterviewer/employees?role=Interviewer,Hr")
      .then((res) => setEmployees(res.data))
      .catch(() =>
        toast.error("Failed to load employees")
      )
      .finally(() => setLoading(false));
  }, []);

  /* ================= MOVE DOWN ================= */
  const handleSelect = (emp) => {
    setEmployees((prev) =>
      prev.filter((e) => e.userId !== emp.userId)
    );

    setSelected((prev) => [
      ...prev,
      { ...emp, interviewRole: "" },
    ]);
  };

  /* ================= MOVE UP ================= */
  const handleRemove = (emp) => {
    setSelected((prev) =>
      prev.filter((e) => e.userId !== emp.userId)
    );

    setEmployees((prev) => [...prev, emp]);
  };

  /* ================= ROLE CHANGE ================= */
  const handleRoleChange = (id, value) => {
    setSelected((prev) =>
      prev.map((e) =>
        e.userId === id
          ? { ...e, interviewRole: value }
          : e
      )
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (selected.length === 0) {
      toast.error("Select at least one interviewer");
      return;
    }

    if (selected.some((s) => !s.interviewRole)) {
      toast.error("Assign role to all interviewers");
      return;
    }

    const payload = {
      jobID: Number(jobId),
      assignments: selected.map((s) => ({
        interviewerID: s.userId,
        interviewRole: s.interviewRole,
      })),
    };

    try {
      setSaving(true);
      await axiosInstance.post(
        "/api/JobInterviewer/assign-v2",
        payload
      );

      toast.success("Interviewers assigned");
      navigate(-1);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Assignment failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Assign Interviewers
      </Typography>

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
              {employees.map((emp) => (
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
                    {emp.systemRole}
                  </TableCell>
                </TableRow>
              ))}

              {employees.length === 0 && (
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
            Selected Interviewers
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
              {selected.map((emp) => (
                <TableRow key={emp.userId}>
                  <TableCell>
                    {emp.fullName}
                  </TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>
                    {emp.designation || "-"}
                  </TableCell>
                  <TableCell>
                    {emp.systemRole}
                  </TableCell>

                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={
                        emp.interviewRole
                      }
                      onChange={(e) =>
                        handleRoleChange(
                          emp.userId,
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="">
                        Select
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

              {selected.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                  >
                    No interviewers selected
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================= SUBMIT ================= */}
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving ? "Saving..." : "Assign"}
      </Button>
    </Box>
  );
}

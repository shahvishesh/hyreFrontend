import { Box, Tabs, Tab, Typography } from "@mui/material";
import { Outlet, useNavigate, useMatch } from "react-router-dom";

export default function InterviewerManagementLayout() {
  const navigate = useNavigate();

  const pendingMatch = useMatch(
    "/dashboard/interviewer-management/pending/*"
  );
  const assignMatch = useMatch(
    "/dashboard/interviewer-management/assign/:jobId"
  );
  const completedMatch = useMatch(
    "/dashboard/interviewer-management/completed/*"
  );
  const modifyMatch = useMatch(
    "/dashboard/interviewer-management/modify/:jobId"
  );
  const viewMatch = useMatch(
    "/dashboard/interviewer-management/view/:jobId"
  );

  const currentTab = pendingMatch || assignMatch
    ? "pending"
    : completedMatch || modifyMatch || viewMatch
    ? "completed"
    : "pending";

  const handleChange = (_, value) => {
    navigate(value);
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Reviewer Management
      </Typography>

      <Tabs
        value={currentTab}
        onChange={handleChange}
        sx={{ mb: 3 }}
      >
        <Tab label="Pending Assignment" value="pending" />
        <Tab label="Completed Assignment" value="completed" />
      </Tabs>

      <Outlet />
    </Box>
  );
}

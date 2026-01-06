import { Box, Tabs, Tab, Typography } from "@mui/material";
import { Outlet, useNavigate, useMatch } from "react-router-dom";

export default function ReviewerManagementLayout() {
  const navigate = useNavigate();

  const pendingMatch = useMatch(
    "/dashboard/reviewer-management/pending/*"
  );
  const assignMatch = useMatch(
    "/dashboard/reviewer-management/assign/:jobId"
  );
  const completedMatch = useMatch(
    "/dashboard/reviewer-management/completed/*"
  );
  const modifyMatch = useMatch(
    "/dashboard/reviewer-management/modify/:jobId"
  );
  const viewMatch = useMatch(
    "/dashboard/reviewer-management/view/:jobId"
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

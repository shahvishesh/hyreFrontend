import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function FeedbackLayout() {
  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Recruiter Decisions
      </Typography>

      <Outlet />
    </Box>
  );
}

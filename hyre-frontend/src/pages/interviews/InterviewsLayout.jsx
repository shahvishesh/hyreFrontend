import { Box, Typography, Divider } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function InterviewsLayout() {
  return (
    <Box>
      <Typography variant="h5" mb={1}>
        Interviews
      </Typography>

      <Typography color="text.secondary" mb={2}>
        Track and manage your interview rounds
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Outlet />
    </Box>
  );
}

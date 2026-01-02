import { Outlet } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function JobsLayout() {
  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Jobs
      </Typography>
      <Outlet />
    </Box>
  );
}

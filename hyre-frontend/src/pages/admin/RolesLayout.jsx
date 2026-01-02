import { Box, Typography, Divider } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function RolesLayout() {
  return (
    <Box>
      <Typography variant="h4" mb={1}>
        Role Management
      </Typography>

      <Typography color="text.secondary" mb={2}>
        Manage system users and their assigned roles
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Outlet />
    </Box>
  );
}

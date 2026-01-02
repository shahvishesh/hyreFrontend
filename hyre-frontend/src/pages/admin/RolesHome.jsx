import { Box, Typography } from "@mui/material";

export default function RolesHome() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        User Roles
      </Typography>

      <Typography color="text.secondary">
        View all system users and their assigned roles.
      </Typography>
    </Box>
  );
}

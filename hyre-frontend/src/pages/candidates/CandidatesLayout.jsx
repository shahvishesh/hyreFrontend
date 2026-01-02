import { Outlet } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function CandidatesLayout() {
  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Candidates
      </Typography>
      <Outlet />
    </Box>
  );
}

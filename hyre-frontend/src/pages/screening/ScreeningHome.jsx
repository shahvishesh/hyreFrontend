import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ScreeningHome() {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography mb={2}>
        Select a job to start screening candidates.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("list")}
      >
        View Open Jobs
      </Button>
    </Box>
  );
}

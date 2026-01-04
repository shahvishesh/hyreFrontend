import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function FeedbackHome() {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography mb={2}>
        Review and submit your interview feedback for assigned jobs.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/dashboard/feedback/list")}
      >
        View Jobs
      </Button>
    </Box>
  );
}

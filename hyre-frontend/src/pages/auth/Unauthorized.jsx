import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function Unauthorized() {
  const navigate = useNavigate();

  // Get user's current roles to display
  const getUserRoles = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        return decoded.roles || [];
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
    return [];
  };

  const userRoles = getUserRoles();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <LockIcon sx={{ fontSize: 80, color: "error.main" }} />
          </Box>

          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Access Denied
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You don't have permission to access this page.
          </Typography>

          {userRoles.length > 0 && (
            <Box
              sx={{
                backgroundColor: "grey.50",
                borderRadius: 2,
                p: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="medium"
                sx={{ mb: 1.5 }}
              >
                Your current roles:
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                justifyContent="center"
                gap={1}
              >
                {userRoles.map((role, index) => (
                  <Chip key={index} label={role} color="primary" />
                ))}
              </Stack>
            </Box>
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            fontStyle="italic"
            sx={{ mb: 4 }}
          >
            If you believe this is an error, please contact your administrator.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={handleGoBack}>
              Go Back
            </Button>
            <Button variant="contained" onClick={handleGoHome}>
              Go to Home
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

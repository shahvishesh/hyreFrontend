import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

export default function Navbar({ drawerWidth }) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const refreshToken =
        localStorage.getItem("refreshToken");

      await axiosInstance.post("/api/auth/logout", {
        refreshToken,
      });

      localStorage.clear();
      toast.success("Logged out");
      navigate("/login");

    } catch (err) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: 1201, ml: `${drawerWidth}px` }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Hyre Dashboard
        </Typography>

        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const drawerWidth = 240;

export default function DashboardLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar drawerWidth={drawerWidth} />
      <Sidebar drawerWidth={drawerWidth} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

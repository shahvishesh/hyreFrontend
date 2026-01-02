import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { ListItemIcon } from "@mui/material";

export default function Sidebar({ drawerWidth }) {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/dashboard")}>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/dashboard/jobs")}>
            <ListItemText primary="Jobs" />
          </ListItemButton>
        </ListItem>

        <ListItemButton onClick={() => navigate("/dashboard/candidates")}>
          <ListItemText primary="Candidates" />
        </ListItemButton>

        <ListItemButton
          onClick={() => navigate("/dashboard/screening")}
        >
          <ListItemText primary="Screening" />
        </ListItemButton>

        <ListItemButton
            onClick={() => navigate("/dashboard/admin/roles")}
          >
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Role Management" />
          </ListItemButton>

      </List>
    </Drawer>
  );
}

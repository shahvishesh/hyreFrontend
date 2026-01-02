import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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
          <ListItemButton onClick={() => navigate("/dashboard/candidates")}>
            <ListItemText primary="Candidates" />
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

      </List>
    </Drawer>
  );
}

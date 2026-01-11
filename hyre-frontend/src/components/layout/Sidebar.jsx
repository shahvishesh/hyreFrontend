import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { ListItemIcon } from "@mui/material";

export default function Sidebar({ drawerWidth }) {
  const navigate = useNavigate();
  const location = useLocation();

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
          <ListItemButton 
            onClick={() => navigate("/dashboard")}
            selected={location.pathname === "/dashboard"}
          >
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => navigate("/dashboard/jobs")}
            selected={location.pathname.startsWith("/dashboard/jobs")}
          >
            <ListItemText primary="Jobs" />
          </ListItemButton>
        </ListItem>

        <ListItemButton 
          onClick={() => navigate("/dashboard/candidates")}
          selected={location.pathname.startsWith("/dashboard/candidates")}
        >
          <ListItemText primary="Candidates" />
        </ListItemButton>

        <ListItemButton
          onClick={() => navigate("/dashboard/screening")}
          selected={location.pathname.startsWith("/dashboard/screening")}
        >
          <ListItemText primary="Screening" />
        </ListItemButton>

        <ListItemButton
          onClick={() => navigate("/dashboard/admin/roles")}
          selected={location.pathname.startsWith("/dashboard/admin/roles")}
        >
          <ListItemIcon>
            <AdminPanelSettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Role Management" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/dashboard/interviews")}
          selected={location.pathname.startsWith("/dashboard/interviews")}
        >
          <ListItemText primary="Interviews" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/dashboard/feedback")}
          selected={location.pathname.startsWith("/dashboard/feedback")}
        >
          <ListItemText primary="Feedback" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/dashboard/recruiter-decisions")}
          selected={location.pathname.startsWith("/dashboard/recruiter-decisions")}
        >
          <ListItemText primary="Recruiter Decisions" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/dashboard/reviewer-management")}
          selected={location.pathname.startsWith("/dashboard/reviewer-management")}
        >
          <ListItemText primary="Reviewer Management" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/dashboard/recruiter-screening")}
          selected={location.pathname.startsWith("/dashboard/recruiter-screening")}
        >
          <ListItemText primary="Recruiter Screening" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/dashboard/interviewer-management")}
          selected={location.pathname.startsWith("/dashboard/interviewer-management")}
        >
          <ListItemText primary="Interviewer Management" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/dashboard/schedule-interview")}
          selected={location.pathname.startsWith("/dashboard/schedule-interview")}
        >
          <ListItemText primary="Schedule Interview" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

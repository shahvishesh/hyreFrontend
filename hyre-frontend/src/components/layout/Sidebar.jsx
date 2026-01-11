import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  ListItemIcon,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InterviewsIcon from "@mui/icons-material/Event";
import FeedbackIcon from "@mui/icons-material/Feedback";
import DecisionIcon from "@mui/icons-material/Gavel";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { hasRole } from "../../utils/auth";
import { PERMISSIONS } from "../../utils/roles";

export default function Sidebar({ drawerWidth }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Menu items configuration with role-based access
  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />,
      permissions: PERMISSIONS.DASHBOARD,
      exact: true,
    },
    {
      label: "Jobs",
      path: "/dashboard/jobs",
      icon: <WorkIcon />,
      permissions: PERMISSIONS.JOBS,
    },
    {
      label: "Candidates",
      path: "/dashboard/candidates",
      icon: <PeopleIcon />,
      permissions: PERMISSIONS.CANDIDATES,
    },
    {
      label: "Interviews",
      path: "/dashboard/interviews",
      icon: <InterviewsIcon />,
      permissions: PERMISSIONS.INTERVIEWS,
    },
    {
      label: "Screening",
      path: "/dashboard/screening",
      icon: <AssignmentIcon />,
      permissions: PERMISSIONS.SCREENING,
    },
    {
      label: "Feedback",
      path: "/dashboard/feedback",
      icon: <FeedbackIcon />,
      permissions: PERMISSIONS.FEEDBACK,
    },
    {
      label: "Recruiter Decisions",
      path: "/dashboard/recruiter-decisions",
      icon: <DecisionIcon />,
      permissions: PERMISSIONS.RECRUITER_DECISIONS,
    },
    {
      label: "Recruiter Screening",
      path: "/dashboard/recruiter-screening",
      icon: <AssignmentIcon />,
      permissions: PERMISSIONS.RECRUITER_SCREENING,
    },
    {
      label: "Reviewer Management",
      path: "/dashboard/reviewer-management",
      icon: <ManageAccountsIcon />,
      permissions: PERMISSIONS.REVIEWER_MANAGEMENT,
    },
    {
      label: "Interviewer Management",
      path: "/dashboard/interviewer-management",
      icon: <ManageAccountsIcon />,
      permissions: PERMISSIONS.INTERVIEWER_MANAGEMENT,
    },
    {
      label: "Schedule Interview",
      path: "/dashboard/schedule-interview",
      icon: <ScheduleIcon />,
      permissions: PERMISSIONS.SCHEDULE_INTERVIEW,
    },
    {
      label: "Role Management",
      path: "/dashboard/admin/roles",
      icon: <AdminPanelSettingsIcon />,
      permissions: PERMISSIONS.ADMIN,
    },
  ];

  // Filter menu items based on user roles
  const visibleMenuItems = menuItems.filter(item => hasRole(item.permissions));

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
        {visibleMenuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={
                item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path)
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

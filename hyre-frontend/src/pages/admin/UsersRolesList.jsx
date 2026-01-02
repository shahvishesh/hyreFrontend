import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAdminUsers } from "../../api/adminRoles.api"; 
import ManageRolesDialog from "./ManageRolesDialog";


export default function UsersRolesList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

const loadUsers = () => {
  setLoading(true);
  getAdminUsers()
    .then((res) => setUsers(res.data))
    .catch(() => toast.error("Failed to load users"))
    .finally(() => setLoading(false));
};


useEffect(() => {
  loadUsers();
}, []);


  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Users & Roles
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>

                <TableCell>
                  {user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Chip
                        key={role}
                        label={role}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No roles
                    </Typography>
                  )}
                </TableCell>

                <TableCell align="center">
                  <IconButton
                        color="primary"
                        onClick={() => setSelectedUser(user)}
                        >
                        <Edit />
                    </IconButton>

                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
        
        {selectedUser && (
  <ManageRolesDialog
    open={!!selectedUser}
    user={selectedUser}
    onClose={() => setSelectedUser(null)}
    onSuccess={loadUsers}
  />
)}

    
    </Box>
  );
}

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllRoles,
  assignRoles,
  removeRoles,
} from "../../api/adminRoles.api";

export default function ManageRolesDialog({
  open,
  onClose,
  user,
  onSuccess,
}) {
  const [allRoles, setAllRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= Load roles ================= */
  useEffect(() => {
    if (!open) return;

    setLoading(true);

    getAllRoles()
      .then((res) => {
        const roles = res.data.data.roles.map(
          (r) => r.name
        );

        setAllRoles(roles);
        setSelectedRoles(user.roles || []);
      })
      .catch(() =>
        toast.error("Failed to load roles")
      )
      .finally(() => setLoading(false));
  }, [open, user]);

  /* ================= Toggle role ================= */
  const handleToggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  /* ================= Save ================= */
  const handleSave = async () => {
    const existingRoles = user.roles || [];

    const rolesToAdd = selectedRoles.filter(
      (r) => !existingRoles.includes(r)
    );

    const rolesToRemove = existingRoles.filter(
      (r) => !selectedRoles.includes(r)
    );

    try {
      setSaving(true);

      if (rolesToAdd.length > 0) {
        await assignRoles({
          userEmail: user.email,
          roleNames: rolesToAdd,
        });
      }

      if (rolesToRemove.length > 0) {
        await removeRoles({
          userEmail: user.email,
          roleNames: rolesToRemove,
        });
      }

      toast.success("Roles updated successfully");
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update roles"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Manage Roles
      </DialogTitle>

      <DialogContent>
        <Typography mb={1}>
          {user.fullName} ({user.email})
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Box>
            {allRoles.map((role) => (
              <FormControlLabel
                key={role}
                control={
                  <Checkbox
                    checked={selectedRoles.includes(
                      role
                    )}
                    onChange={() =>
                      handleToggleRole(role)
                    }
                  />
                }
                label={role}
              />
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || loading}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

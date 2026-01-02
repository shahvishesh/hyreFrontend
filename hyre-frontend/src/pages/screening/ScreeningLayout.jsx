import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export default function ScreeningLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}

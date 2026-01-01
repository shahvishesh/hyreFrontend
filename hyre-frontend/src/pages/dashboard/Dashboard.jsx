import { Typography, Card, CardContent } from "@mui/material";

export default function Dashboard() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Welcome to Hyre</Typography>
        <Typography color="text.secondary">
          Recruitment Management Dashboard
        </Typography>
      </CardContent>
    </Card>
  );
}

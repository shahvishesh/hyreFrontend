import { Button, Card, CardContent, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function JobsHome() {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <h3>View Jobs</h3>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/jobs/list")}
            >
              Go
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <h3>Create Job</h3>
            <Button
              variant="contained"
              onClick={() => navigate("/dashboard/jobs/create")}
            >
              Create
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

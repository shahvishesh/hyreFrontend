import { Button, Card, CardContent, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CandidatesHome() {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <h3>View Candidates</h3>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/candidates/list")}
            >
              Go
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <h3>Create Candidate</h3>
            <Button
              variant="contained"
              onClick={() => navigate("/dashboard/candidates/create")}
            >
              Create
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <h3>Upload Excel</h3>
            <Button
              variant="outlined"
              onClick={() =>
                navigate("/dashboard/candidates/upload-excel")
              }
            >
              Upload
            </Button>
          </CardContent>
        </Card>
      </Grid>

    </Grid>

    
  );
}

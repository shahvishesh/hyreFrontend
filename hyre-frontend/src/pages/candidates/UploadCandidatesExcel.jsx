import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { useState } from "react";
import { uploadCandidatesExcel } from "../../api/candidates.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function UploadCandidatesExcel() {
  const navigate = useNavigate();
  const [excelFile, setExcelFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setExcelFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!excelFile) {
      toast.error("Please select an Excel file");
      return;
    }

    try {
      setLoading(true);
      await uploadCandidatesExcel(excelFile);
      toast.success("Candidates uploaded successfully");
      navigate("/dashboard/candidates/list");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to upload Excel file"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" mb={3}>
        Upload Candidates (Excel)
      </Typography>

      <Card>
        <CardContent>
          {!excelFile ? (
            <Button
              component="label"
              startIcon={<UploadFile />}
              variant="outlined"
              fullWidth
            >
              Select Excel File
              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </Button>
          ) : (
            <Box>
              <Typography>
                Selected file: <strong>{excelFile.name}</strong>
              </Typography>

              <Box mt={2} display="flex" gap={2}>
                <Button
                  component="label"
                  variant="outlined"
                >
                  Change File
                  <input
                    type="file"
                    hidden
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                  />
                </Button>

                <Button
                  color="error"
                  onClick={() => setExcelFile(null)}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          )}

          <Box mt={3}>
            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={handleUpload}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

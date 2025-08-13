import React, { useContext, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { toast } from "react-toastify";
import apis from "../../../assets/utils/apis";
import httpAction from "../../../assets/utils/httpAction";
import { AppContent } from "../../../context/AppContext";

const ReportBug = () => {
  const { userData } = useContext(AppContent);
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [severity, setSeverity] = useState("Medium");

  const severityEmojis = {
    Low: "🟢",
    Medium: "🟡",
    High: "🔴",
  };

  const handleSubmit = async () => {
    if (!userData) {
      toast.error("⚠️ Please log in first to report an issue.");
      return;
    }

    if (!description.trim()) {
      toast.error("⚠️ Description is required.");
      return;
    }

    const data = {
      url: apis().reportBug,
      method: "POST",
      body: { description, stepsToReproduce: steps, severity },
    };

    const result = await httpAction(data);
    if (result.success) {
      toast.success("✅ Bug reported successfully!");
      setDescription("");
      setSteps("");
      setSeverity("Medium");
    } else {
      toast.error(result.message || "❌ Failed to report bug.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, mb: 6, px: 2 }}>
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 3,
          background: "#f9f9ff",
          transition: "0.3s ease-in-out",
          "&:hover": { boxShadow: 6 },
        }}
      >
        <CardHeader
          title="🐞 Report a Bug"
          subheader="Help us improve by reporting an issue."
          sx={{
            backgroundColor: "#f3414a",
            color: "white",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            textAlign: "center",
          }}
        />

        <CardContent>
          <TextField
            label="🐛 Bug Description"
            fullWidth
            multiline
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          <TextField
            label="📝 Steps to Reproduce"
            fullWidth
            multiline
            rows={2}
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            margin="normal"
          />
          <TextField
            label="⚡ Severity"
            fullWidth
            select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            margin="normal"
          >
            {["Low", "Medium", "High"].map((level) => (
              <MenuItem key={level} value={level}>
                {severityEmojis[level]} {level}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#5ce1e8",
                color: "black",
                fontWeight: 600,
                px: 4,
                py: 1,
                "&:hover": { backgroundColor: "#f3414a" },
              }}
            >
              📨 Submit Bug Report
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportBug;

import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

const API = import.meta.env.VITE_API_URL;
export default function LoginPage() {
  const [info, setInfo] = useState({ email: "", password: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      const data = await response.json();

      if (response.ok) {
        setSnackbarOpen(true);

        localStorage.setItem("token", data.token);
        navigate("/table");
      } else {
        alert(data.message || "Invalid emaillllll or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("something went wrong! please try again.");
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(to right, #56ccf2, #2f70ed)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          bgcolor: "rgb(255, 255, 255)",
          mt: 2,
          pt: 5,
          pb: 5,
          borderRadius: 1,
          width: "40%",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Login
        </Typography>
        <TextField
          label="email"
          type="email"
          variant="outlined"
          sx={{
            m: 2,
            width: "70%",
          }}
          value={info.email}
          onChange={(e) => setInfo({ ...info, email: e.target.value })}
        />
        <TextField
          label="password"
          type="password"
          variant="outlined"
          sx={{
            m: 2,
            width: "70%",
          }}
          value={info.password}
          onChange={(e) => setInfo({ ...info, password: e.target.value })}
        />
        <Link href="/register" sx={{ fontFamily: "sans-serif", mb: 2 }}>
          Don't have an acoount? click here!
        </Link>
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          icon={<CheckIcon fontSize="inherit" />}
          sx={{ width: "100%" }}
        >
          Login successful!
        </Alert>
      </Snackbar>
    </Box>
  );
}

import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function RegisterPage() {
  const [info, setInfo] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (info.password !== info.confirmPassword) {
      alert(" passwords do not match!");
      return;
    }
    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: info.name,
          age: parseInt(info.age),
          email: info.email,
          password: info.password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Registeration successful!");
        navigate("/table");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong.");
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
          Welcome!
        </Typography>
        <TextField
          label="Name"
          variant="outlined"
          sx={{
            m: 2,
            width: "70%",
          }}
          value={info.name}
          onChange={(e) => setInfo({ ...info, name: e.target.value })}
        />
        <TextField
          label="age"
          variant="outlined"
          inputProps={{ min: 0, max: 150 }}
          sx={{
            m: 2,
            width: "70%",
          }}
          value={info.age}
          onChange={(e) => setInfo({ ...info, age: e.target.value })}
        />
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
        <TextField
          label="confirm password"
          type="password"
          variant="outlined"
          sx={{
            m: 2,
            mb: 4,
            width: "70%",
          }}
          value={info.confirmPassword}
          onChange={(e) =>
            setInfo({ ...info, confirmPassword: e.target.value })
          }
        />
        <Link href="/login " sx={{ fontFamily: "sans-serif", mb: 2 }}>
          Already have an account? click here!
        </Link>
        <Button variant="contained" onClick={handleRegister}>
          Register
        </Button>
      </Box>
    </Box>
  );
}

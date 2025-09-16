import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";

// ✅ Basic-auth helper (place src/auth.js in your front app)
import { getApiUrl, authHeaders, setBasicAuth } from "../../auth";

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
    const name = (info.name || "").trim();
    const email = (info.email || "").trim();
    const ageNum = Number(info.age);
    const password = info.password || "";
    const confirmPassword = info.confirmPassword || "";

    if (!name || !email || Number.isNaN(ageNum) || !password) {
      alert("Please fill name, valid age, email, and password.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Backend should expose POST /auth/register
      const res = await fetch(`${getApiUrl()}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age: ageNum,
          email,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // ✅ Save Basic creds locally (front-end Basic flow)
      setBasicAuth(email, password);

      // (Optional) quick verification call to a protected endpoint
      // If you prefer to skip this, remove the block below.
      try {
        const ping = await fetch(`${getApiUrl()}/users`, {
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
        });
        if (!ping.ok) {
          // Not fatal; still navigate. But warn the user.
          console.warn("Post-register verification failed:", await ping.text());
        }
      } catch (e) {
        console.warn("Post-register verification error:", e);
      }

      alert("Registration successful!");
      navigate("/table");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message || "Something went wrong.");
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
          sx={{ m: 2, width: "70%" }}
          value={info.name}
          onChange={(e) => setInfo({ ...info, name: e.target.value })}
        />

        <TextField
          label="age"
          variant="outlined"
          inputProps={{ min: 0, max: 150 }}
          sx={{ m: 2, width: "70%" }}
          value={info.age}
          onChange={(e) => setInfo({ ...info, age: e.target.value })}
        />

        <TextField
          label="email"
          type="email"
          variant="outlined"
          sx={{ m: 2, width: "70%" }}
          value={info.email}
          onChange={(e) => setInfo({ ...info, email: e.target.value })}
        />

        <TextField
          label="password"
          type="password"
          variant="outlined"
          sx={{ m: 2, width: "70%" }}
          value={info.password}
          onChange={(e) => setInfo({ ...info, password: e.target.value })}
        />

        <TextField
          label="confirm password"
          type="password"
          variant="outlined"
          sx={{ m: 2, mb: 4, width: "70%" }}
          value={info.confirmPassword}
          onChange={(e) => setInfo({ ...info, confirmPassword: e.target.value })}
        />

        <Link href="/login" sx={{ fontFamily: "sans-serif", mb: 2 }}>
          Already have an account? click here!
        </Link>

        <Button variant="contained" onClick={handleRegister}>
          Register
        </Button>
      </Box>
    </Box>
  );
}

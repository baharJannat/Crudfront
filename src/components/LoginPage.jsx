import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

export default function LoginPage() {

   const GetInfo= () =>{

    }


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
          variant="outlined"
          sx={{
            m: 2,
            width: "70%",
          }}
        />
        <TextField
          label="passowrd"
          variant="outlined"
          sx={{
            m: 2,
            width: "70%",
          }}
        />
        <Link href="#" sx={{fontFamily:"sans-serif", mb:2}}>Don't have an acoount? click here!</Link>
         <Button variant="contained">Login</Button>
      </Box>
    </Box>
  );
}

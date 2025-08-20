import React from "react";
import Button from "@mui/material/Button";
import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const CreateButton = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");

  // CreateButton.jsx
  const handleCreate = async () => {
    const newUser = {
      name: (name || "New User").trim(),
      age: Number(age) || 30,
      email: (email || `user${Date.now()}@example.com`).trim(), // avoids duplicate default email
    };
    try {
      await onCreate(newUser); // relies on Table.handleCreate returning a promise
      setOpen(false);
      setName("");
      setAge("");
      setEmail("");
    } catch (e) {
      alert(e.message || "Create failed");
    }
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <Box>
      <Button
        onClick={handleOpen}
        variant="contained"
        style={{ marginLeft: "16px" }}
      >
        create
      </Button>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <button
            onClick={handleClose}
            style={{ alignSelf: "flex-end", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
          >
            ⤫
          </button>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: "5px",
              marginTop: "5px",
            }}
          />
          <TextField
            label="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: "5px",
              marginTop: "5px",
            }}
          />
          <TextField
            label="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: "5px",
              marginTop: "5px",
            }}
            variant="outlined"
          />

          <Button
            variant="contained"
            onClick={handleCreate}
            style={{ marginTop: "5px", width: "100%" }}
          >
            Create
          </Button>
        </Box>
      </Backdrop>
    </Box>
  );
};

export default CreateButton;

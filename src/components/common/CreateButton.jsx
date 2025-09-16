import React, { useState } from "react";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

// ✅ import API + Basic headers
import { getApiUrl, authHeaders } from "../../auth";

const CreateButton = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  // ✅ create user directly with fetch + Basic auth
  const handleCreate = async () => {
    const newUser = {
      name: (name || "New User").trim(),
      age: Number(age) || 30,
      email: (email || `user${Date.now()}@example.com`).trim(),
      password: "secret123", // required by backend schema
    };

    try {
      const res = await fetch(`${getApiUrl()}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Create failed");

      // reset UI
      setOpen(false);
      setName("");
      setAge("");
      setEmail("");

      if (onCreated) onCreated(data); // optional callback to refresh table
    } catch (err) {
      alert(err.message || "Create failed");
    }
  };

  return (
    <Box>
      <Button
        onClick={handleOpen}
        variant="contained"
        style={{ marginLeft: "16px" }}
      >
        Create
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
            sx={{ backgroundColor: "white", borderRadius: "5px", marginTop: "5px" }}
          />
          <TextField
            label="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            sx={{ backgroundColor: "white", borderRadius: "5px", marginTop: "5px" }}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ backgroundColor: "white", borderRadius: "5px", marginTop: "5px" }}
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

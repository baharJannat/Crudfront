import React from "react";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

// ✅ Basic-auth helper (src/auth.js)
import { getApiUrl, authHeaders } from "../../auth";

export default function PutButton({ selectedIds, selectedUsers = [], onPut }) {
  const [open, setOpen] = React.useState(false);
  const [initialUser, setInitialUser] = React.useState(null);
  const [name, setName] = React.useState("");
  const [age, setAge] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    if (!selectedUsers || selectedUsers.length === 0) {
      alert("Select one user for PUT update!");
      return;
    }
    if (selectedUsers.length > 1) {
      alert("You can only select one at a time");
      return;
    }

    const user = selectedUsers[0];
    if (!user) {
      alert("No valid user selected.");
      return;
    }

    setInitialUser(user);
    setName(user.name || "");
    setAge(user.age?.toString() || "");
    setEmail(user.email || "");
    setOpen(true);
  };

  const handlePut = async () => {
    if (!selectedIds || selectedIds.length === 0) {
      alert("Select one user for PUT update");
      return;
    }
    if (selectedIds.length > 1) {
      alert("You can only PUT one user at a time");
      return;
    }

    const id = selectedIds[0];

    // PUT = full replacement → require all fields present
    const trimmedName = (name || "").trim();
    const trimmedEmail = (email || "").trim();
    const numAge = Number(age);

    if (!trimmedName || !trimmedEmail || Number.isNaN(numAge)) {
      alert("PUT requires valid name, age (number), and email.");
      return;
    }

    // Optional: warn if no actual changes compared to initial
    if (
      initialUser &&
      trimmedName === (initialUser.name || "") &&
      numAge === Number(initialUser.age) &&
      trimmedEmail === (initialUser.email || "")
    ) {
      const proceed = window.confirm(
        "No changes detected. Do you still want to PUT the same values?"
      );
      if (!proceed) return;
    }

    const body = {
      name: trimmedName,
      age: numAge,
      email: trimmedEmail,
    };

    try {
      const res = await fetch(`${getApiUrl()}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(), // ✅ Basic
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `PUT failed (${res.status})`);

      setOpen(false);
      if (onPut) onPut([id], body); // keep backward-compat callback for parent refresh
    } catch (err) {
      alert(err.message || "PUT failed.");
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpen}
        style={{ marginLeft: "16px", backgroundColor: "#1976d2" }}
      >
        PUT
      </Button>

      <Box>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={open}
        >
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <button
              onClick={handleClose}
              style={{
                alignSelf: "flex-end",
                cursor: "pointer",
                marginBottom: "10px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
            >
              X
            </button>

            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: "5px" }}
            />
            <TextField
              label="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                marginTop: "10px",
              }}
              variant="outlined"
            />

            <Button
              variant="contained"
              onClick={handlePut}
              style={{ marginTop: "10px", backgroundColor: "#1976d2" }}
            >
              PUT
            </Button>
          </Box>
        </Backdrop>
      </Box>
    </div>
  );
}

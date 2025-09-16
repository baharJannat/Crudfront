import React from "react";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

// ✅ Basic-auth helper (put src/auth.js in your front)
import { getApiUrl, authHeaders } from "../../auth";

export default function PatchButton({
  selectedIds,
  selectedUsers = [],
  onPatched, // optional: parent can refresh table
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [age, setAge] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    if (!selectedUsers || selectedUsers.length === 0) {
      alert("Select at least one user for PATCH update!");
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

    setName(user.name || "");
    setAge(user.age?.toString() || "");
    setEmail(user.email || "");
    setOpen(true);
  };

  const handlePatch = async () => {
    if (!selectedIds || selectedIds.length === 0) {
      alert("Select at least one user for PATCH update!");
      return;
    }
    if (selectedIds.length > 1) {
      alert("You can only patch one user at a time");
      return;
    }

    const id = selectedIds[0];
    const payload = {};
    if (name !== "") payload.name = name.trim();
    if (age !== "") payload.age = Number(age);
    if (email !== "") payload.email = email.trim();

    if (Object.keys(payload).length === 0) {
      alert("Nothing to update.");
      return;
    }

    try {
      const res = await fetch(`${getApiUrl()}/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `PATCH failed (${res.status})`);

      setOpen(false);
      if (onPatched) onPatched(data);
    } catch (err) {
      alert(err.message || "PATCH failed.");
    }
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="contained"
        style={{ marginLeft: "16px", backgroundColor: "#1976d2" }}
      >
        PATCH
      </Button>

      <Box>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={open}
        >
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <button
              onClick={handleClose}
              style={{ alignSelf: "flex-end", cursor: "pointer", marginBottom: "10px" }}
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
              sx={{ backgroundColor: "white", borderRadius: "5px", marginTop: "10px" }}
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: "5px", marginTop: "10px" }}
              variant="outlined"
            />

            <Button
              variant="contained"
              onClick={handlePatch}
              style={{ marginTop: "10px", backgroundColor: "#1976d2" }}
            >
              PATCH
            </Button>
          </Box>
        </Backdrop>
      </Box>
    </div>
  );
}

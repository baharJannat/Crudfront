import React from "react";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function PatchButton({
  selectedIds,
  selectedUsers = [],
  onPatch,
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [age, setAge] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    if (selectedUsers.length === 0) {
      alert("Select at least one user for PATCH updateeee!");
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

  const handlePatch = () => {
    if (selectedIds.length === 0) {
      alert("select at least one user for PATCH updateeeeee!");
      return;
    }

    const payload = {};
    if (name !== "") payload.name = name;
    if (age !== "") payload.age = +age; // convert to number if you like
    if (email !== "") payload.email = email;
    
    onPatch(selectedIds, payload);
    setOpen(false);
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

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={open}
        >
          <button
            onClick={handleClose}
            style={{ alignSelf: "flex-end", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
          >
            X
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
            onClick={handlePatch}
            style={{ marginLeft: "16px", backgroundColor: "#1976d2" }}
          >
            PATCH
          </Button>
        </Backdrop>
      </Box>
    </div>
  );
}

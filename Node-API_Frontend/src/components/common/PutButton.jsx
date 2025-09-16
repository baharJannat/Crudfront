import React from "react";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function PutButton({ selectedIds, selectedUsers = [], onPut }) {
  const [open, setOpen] = React.useState(false);
  const [initialUser, setInitialUser] = React.useState(null);
  const [name, setName] = React.useState("");
  const [age, setAge] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    if (selectedUsers.length === 0) {
      alert("Select at least one user for PUT update!");
      return;
    }
    if (selectedUsers.length > 1) {
      alert("you can only select one at a time");
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
  const handlePut = () => {
    if (selectedIds.length === 0) {
      alert("Select at least one user for PUT update");
      return;
    }

    const payload = {};
    if (name !== initialUser.name) payload.name = name;
    if (+age !== initialUser.age) payload.age = +age;
    if (email !== initialUser.email) payload.email = email;

    if (Object.keys(payload).length === 0) {
      alert("You must apply changes before PUT.");
      return;
    }
    if (
      name.trim() === initialUser.name ||
      parseInt(age) === initialUser.age ||
      email.trim() === initialUser.email
    ) {
      alert("All fields must be updated for a full PUT.");
      return;
    }
    console.log("PUT payload:", payload);
    onPut(selectedIds, payload);
    setOpen(false);
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
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
              }}
            />
            <TextField
              label="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            />
            <TextField
              label="email"
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

import React from "react";
import Button from "@mui/material/Button";

const CreateButton = ({ onCreate }) => {
  const handleCreate = () => {
    const newUser = {
      name: "New User",
      age: 30,
      email: "new@example.com",
    };
    onCreate(newUser);
  };

  return (
    <Button variant="contained" onClick={handleCreate} style={{ marginLeft: "16px" }}>
      Create
    </Button>
  );
};

export default CreateButton;

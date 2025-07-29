import React from "react";
import Button from "@mui/material/Button";

const UpdateButton = ({ selectedIds, onUpdate }) => {
  const handleUpdate = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one user to update.");
      return;
    }
    onUpdate(selectedIds);
  };

  return (
    <Button
      variant="contained"
      onClick={handleUpdate}
      style={{ marginLeft: "16px" }}
    >
      Update
    </Button>
  );
};

export default UpdateButton;

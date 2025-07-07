import React from "react";
import Button from "@mui/material/Button";

const DeleteButton = ({ selectedIds, onDelete }) => {
  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    onDelete(selectedIds);
  };

  return (
    <Button variant="contained" onClick={handleDelete} style={{ marginLeft: "16px" }}>
      Delete
    </Button>
  );
};

export default DeleteButton;

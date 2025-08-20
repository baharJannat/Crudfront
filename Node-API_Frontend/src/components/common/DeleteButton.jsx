import React from "react";
import Button from "@mui/material/Button";

const DeleteButton = ({ selectedIds, onDelete }) => {
  const handleDelete = () => {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} user(s)?`
    );
    if (confirmed) {
      onDelete(selectedIds);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleDelete}
      style={{ marginLeft: "16px" }}
    >
      Delete
    </Button>
  );
};

export default DeleteButton;

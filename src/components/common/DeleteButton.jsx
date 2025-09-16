import React from "react";
import Button from "@mui/material/Button";
import { getApiUrl, authHeaders } from "../../auth";

const DeleteButton = ({ selectedIds, onDelete  }) => {
  const handleDelete = async () => {
    if (!selectedIds || selectedIds.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} user(s)?`
    );
    if (!confirmed) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`${getApiUrl()}/users/${id}`, {
            method: "DELETE",
            headers: {
              ...authHeaders(),
            },
          })
        )
      );

      if (onDelete ) onDelete (selectedIds); // optional callback to refresh table
    } catch (err) {
      alert(err.message || "Delete failed");
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

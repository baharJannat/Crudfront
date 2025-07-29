import React from "react";
import Button from "@mui/material/Button";

export default function PutButton({ selectedIds, onPut }) {
  const handlePut = () => {
    if (selectedIds.length === 0) {
      alert("Select at least one user for PUT update");
      return;
    }
    onPut(selectedIds);
  };
  return (
    <Button
      variant="contained"
      onClick={handlePut}
      style={{ marginLeft: "16px", backgroundColor: "#1976d2" }}
    >
      PUT
    </Button>
  );
}

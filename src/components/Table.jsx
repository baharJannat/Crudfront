import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridFooterContainer,
  GridPagination,
} from "@mui/x-data-grid";
import DeleteButton from "./DeleteButton";
import UpdateButton from "./UpdateButton";
import CreateButton from "./CreateButton";

function CustomFooter({ selectedIds, onDelete, onCreate, onUpdate }) {
  return (
    <GridFooterContainer>
      <DeleteButton selectedIds={selectedIds} onDelete={onDelete} />
      <UpdateButton selectedIds={selectedIds} onUpdate={onUpdate} />
      <CreateButton onCreate={onCreate} />
      <GridPagination />
    </GridFooterContainer>
  );
}

function Table() {
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [updatedRows, setUpdatedRows] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error(err));
  };

  const handleDelete = (ids) => {
    Promise.all(
      ids.map((id) =>
        fetch(`http://localhost:5000/users/${id}`, {
          method: "DELETE",
        })
      )
    )
      .then(fetchUsers)
      .catch(console.error);
  };

  const handleCreate = (user) => {
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then(fetchUsers)
      .catch(console.error);
  };

  const handleUpdate = (ids) => {
    const updates = ids.map((id) => updatedRows[id]).filter(Boolean);

    if (updates.length === 0) {
      alert("No updates to apply.");
      return;
    }

    Promise.all(
      updates.map((row) =>
        fetch(`http://localhost:5000/users/${row.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: row.name,
            age: row.age,
            email: row.email,
          }),
        })
      )
    )
      .then(() => {
        setUpdatedRows({});
        fetchUsers();
      })
      .catch(console.error);
  };

  const columns = [
    { field: "name", headerName: "Name", editable: true },
    { field: "age", headerName: "Age", type: "number", editable: true },
    { field: "email", headerName: "Email", type: "email", editable: true },
  ];

  const rows = users.map((user, index) => ({
    id: user._id || index,
    name: user.name,
    age: user.age,
    email: user.email,
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{
          footer: () => (
            <CustomFooter
              selectedIds={selectedIds}
              onDelete={handleDelete}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
            />
          ),
        }}
        onRowSelectionModelChange={(selectionModel) => {
          const selected = Array.from(selectionModel?.ids || []);
          console.log("Selected IDs:", selected);
          setSelectedIds(selected);
        }}
        processRowUpdate={(newRow) => {
          setUpdatedRows((prev) => ({ ...prev, [newRow.id]: newRow }));
          return newRow;
        }}
        experimentalFeatures={{ newEditingApi: true }}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default Table;

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridFooterContainer,
  GridPagination,
} from "@mui/x-data-grid";
import DeleteButton from "../common/DeleteButton";
import UpdateButton from "../common/UpdateButton";
import CreateButton from "../common/CreateButton";
import PutButton from "../common/PutButton";
import PatchButton from "../common/PatchButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";

function CustomFooter({
  selectedIds,
  // selectedUsers,
  onDelete,
  onCreate,
  onPut,
  onPatch,
  users,
}) {
  console.log("selectedIds:", selectedIds);

  return (
    <GridFooterContainer>
      <DeleteButton selectedIds={selectedIds} onDelete={onDelete} />
      <PutButton selectedIds={selectedIds} onPut={onPut} />
      <PatchButton
        selectedIds={selectedIds}
        selectedUsers={users.filter((u) =>
          selectedIds.includes((u._id ?? "").toString())
        )}
        onPatch={onPatch}
      />

      <CreateButton onCreate={onCreate} />
      <GridPagination />
    </GridFooterContainer>
  );
}

function Table() {
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [updatedRows, setUpdatedRows] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

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

  const handlePut = (ids) => {
    const updates = ids.map((id) => updatedRows[id]).filter(Boolean);

    if (updates.length === 0) {
      alert("No PUT updates to apply.");
      return;
    }

    Promise.all(
      updates.map((row) =>
        fetch(`http://localhost:5000/users/${row.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(row),
        })
      )
    )
      .then(() => {
        setUpdatedRows({});
        fetchUsers();
      })
      .catch(console.error);
  };

  const handlePatch = (ids, patchData = null) => {
    let updates=[];
    if (patchData && Object.keys(patchData).length > 0) {
    updates = ids.map((id) => ({ id, ...patchData }));
    } else {
      updates = ids.map((id) => updatedRows[id]).filter(Boolean);
    }

    if (updates.length === 0) {
      alert("No PATCH updates to apply.");
      return;
    }

    Promise.all(
      updates.map((row) =>
        fetch(`http://localhost:5000/users/${row.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(row),
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
    { field: "email", headerName: "Email", editable: true },
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
              onPut={handlePut}
              onPatch={handlePatch}
              users={users}
            />
          ),
        }}
        onRowDoubleClick={(params) => {
          setSelectedRow(params.row);
          setDialogOpen(true);
        }}
        onRowSelectionModelChange={(newSelection) => {
          const ids = Array.isArray(newSelection) // v6 and below
            ? newSelection
            : Array.from(newSelection?.ids ?? []); // v7
          setSelectedIds(ids); // now ["6888964cfdf6f338719494f0"]
        }}
        processRowUpdate={(newRow) => {
          setUpdatedRows((prev) => ({ ...prev, [newRow.id]: newRow }));
          return newRow;
        }}
        experimentalFeatures={{ newEditingApi: true }}
        checkboxSelection
        disableRowSelectionOnClick
      />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>User Information</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <Box>
              <Typography>
                <strong>Name:</strong> {selectedRow.name}
              </Typography>
              <Typography>
                <strong>Age:</strong> {selectedRow.age}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedRow.email}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Table;

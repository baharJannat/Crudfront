import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridFooterContainer, GridPagination } from "@mui/x-data-grid";
import DeleteButton from "../common/DeleteButton";
import CreateButton from "../common/CreateButton";
import PutButton from "../common/PutButton";
import PatchButton from "../common/PatchButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";

// ✅ NEW: use shared Basic-auth helper (put src/auth.js at project root under src/)
import { getApiUrl, authHeaders } from "../../auth"; // adjust path if your Table.jsx is elsewhere

function CustomFooter({ selectedIds, onDelete, onCreate, onPut, onPatch, users }) {
  return (
    <GridFooterContainer>
      <DeleteButton selectedIds={selectedIds} onDelete={onDelete} />
      <PutButton
        selectedIds={selectedIds}
        selectedUsers={users.filter((u) => selectedIds.includes((u._id ?? "").toString()))}
        onPut={onPut}
      />
      <PatchButton
        selectedIds={selectedIds}
        selectedUsers={users.filter((u) => selectedIds.includes((u._id ?? "").toString()))}
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
  const [updatedRows, setUpdatedRows] = useState({}); // { [id]: full row }
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${getApiUrl()}/users`, {
        // ✅ now uses Basic headers
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fetch users failed");
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users. Are you logged in and is the API reachable?");
    }
  };

  const handleDelete = async (ids) => {
    await Promise.all(
      ids.map((id) =>
        fetch(`${getApiUrl()}/users/${id}`, {
          method: "DELETE",
          headers: {
            ...authHeaders(), // ✅ Basic
          },
        })
      )
    );
    await fetchUsers();
    setSelectedIds([]);
  };

  const handleCreate = async (user) => {
    const res = await fetch(`${getApiUrl()}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(), // ✅ Basic
      },
      body: JSON.stringify({ ...user, age: Number(user.age) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Create failed (${res.status})`);
    await fetchUsers();
  };

  // ✅ PUT must send full document (name, age, email). Use updatedRows (not "edited")
  const handlePut = async (ids, fullBody = null) => {
    try {
      const payloads =
        fullBody && ids.length === 1
          ? [{ id: ids[0], ...fullBody }]
          : ids.map((id) => ({ id, ...(updatedRows[id] || {}) }));

      // Basic validation to avoid sending empty bodies
      for (const p of payloads) {
        if (!p.name || !p.email || Number.isNaN(Number(p.age))) {
          throw new Error("PUT requires name, valid age, and email for each selected row.");
        }
      }

      await Promise.all(
        payloads.map((p) =>
          fetch(`${getApiUrl()}/users/${p.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders(), // ✅ Basic
            },
            body: JSON.stringify({
              name: p.name,
              age: Number(p.age),
              email: p.email,
            }),
          })
        )
      );
      setUpdatedRows({});
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.message || "PUT failed.");
    }
  };

  // ✅ PATCH sends only changed fields; derive from updatedRows if no dialog body provided
  const handlePatch = async (ids, patchBody = null) => {
    try {
      const payloads =
        patchBody && Object.keys(patchBody).length > 0
          ? ids.map((id) => ({ id, ...patchBody }))
          : ids.map((id) => ({ id, ...(updatedRows[id] || {}) }));

      await Promise.all(
        payloads.map(({ id, ...body }) =>
          fetch(`${getApiUrl()}/users/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders(), // ✅ Basic
            },
            body: JSON.stringify(body),
          })
        )
      );
      setUpdatedRows({});
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert("PATCH failed.");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", editable: false }, // ✅ keep ID read-only
    { field: "name", headerName: "Name", editable: true },
    { field: "age", headerName: "Age", type: "number", editable: true },
    { field: "email", headerName: "Email", editable: true },
  ];

  const rows = users.map((u) => ({
    id: (u._id ?? "").toString(),
    name: u.name,
    age: u.age,
    email: u.email,
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
        onRowDoubleClick={async (params) => {
          try {
            const res = await fetch(`${getApiUrl()}/users/${params.row.id}`, {
              headers: {
                "Content-Type": "application/json",
                ...authHeaders(), // ✅ Basic
              },
            });
            if (!res.ok) throw new Error(`Failed to fetch user (${res.status})`);
            const user = await res.json();
            setSelectedRow(user);
            setDialogOpen(true);
          } catch (err) {
            console.error("Error fetching user:", err);
            alert("Could not fetch user details.");
          }
        }}
        onRowSelectionModelChange={(newSelection) => {
          // DataGrid v6 returns an array; keep defensive fallback
          const ids = Array.isArray(newSelection)
            ? newSelection
            : Array.from(newSelection?.ids ?? []);
          setSelectedIds(ids);
        }}
        processRowUpdate={(newRow) => {
          // Keep latest edits per row id
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

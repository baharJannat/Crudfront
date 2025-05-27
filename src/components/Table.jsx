import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridFooterContainer,
  GridPagination,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";

function CustomFooter() {
  return (
    <GridFooterContainer>
      <Button
        variant="contained"
        style={{ marginLeft: "16px"}}
      >
        Delete
      </Button>
      <Button
        variant="contained"
        style={{ marginLeft: "16px"}}
      >
        Update
      </Button>
      <Button
        variant="contained"
        style={{ marginLeft: "16px"}}
      >
        Create
      </Button>
      <GridPagination/>
    </GridFooterContainer>
  );
}

function Table() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const columns = [
    { field: "name", headerName: "Name", editable: true },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      type: "email",
      editable: true,
    },
  ];

  const rows = users.map((user, index) => ({
    id: user._id || index,
    name: user.name,
    age: user.age,
    email: user.email,
  }));

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ footer: CustomFooter }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
}

export default Table;

import React, { useEffect, useState } from "react";
import axios from "axios";


export default function Delete(){
    const [ users , setUsers ] = useState([]);
    useEffect(() => {
    axios
      .delete("http://localhost:5000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);
}
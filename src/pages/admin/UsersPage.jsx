import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { getAllUsers, updateUserRole } from "../../services/api";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  // ✅ Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Toggle role between freemium & premium
  const handleToggleRole = async (id, currentRole) => {
    try {
      const newRole = currentRole === "premium" ? "freemium" : "premium";
      const updatedUser = await updateUserRole(id, newRole);

      // Update UI instantly
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: updatedUser.role } : u))
      );
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" p={2}>
        Users Management
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell align="center">
                {user.role !== "admin" && (
                  <Button
                    variant="contained"
                    color={user.role === "premium" ? "warning" : "success"}
                    onClick={() => handleToggleRole(user._id, user.role)}
                  >
                    {user.role === "premium" ? "Demote" : "Promote"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersPage;

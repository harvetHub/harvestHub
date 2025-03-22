"use client";

import { useState, useEffect } from "react";
import UserTable from "@/components/admin/user/UserTable";
import UserForm from "@/components/admin/user/UserForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { AdminMainLayout } from "@/layout/AdminMainLayout";
import { User } from "@/lib/definitions";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    user_id: 0,
    name: { first: "", middle: "", last: "" },
    username: "",
    email: "",
    role: "",
    address: "",
    mobile_number: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        Swal.fire("Error", data.error || "Failed to fetch users", "error");
      }
    } catch {
      Swal.fire("Error", "An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter((user) =>
      `${user.name?.first} ${user.name?.last}`.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      user_id: 0,
      name: { first: "", middle: "", last: "" },
      username: "",
      email: "",
      role: "",
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      user_id: user.user_id,
      name: user.name || { first: "", middle: "", last: "" },
      username: user.username,
      email: user.email,
      role: user.role || "",
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/admin/users?user_id=${userId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            Swal.fire("Deleted!", "The user has been deleted.", "success");
            fetchUsers(); // Refresh the user list
          } else {
            const data = await response.json();
            Swal.fire("Error", data.error || "Failed to delete user.", "error");
          }
        } catch {
          Swal.fire("Error", "An unexpected error occurred.", "error");
        }
      }
    });
  };

  const handleSaveUser = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        method: editingUser ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire(
          "Success",
          editingUser
            ? "User updated successfully."
            : "User added successfully.",
          "success"
        );
        setIsDialogOpen(false);
        fetchUsers(); // Refresh the user list
      } else {
        Swal.fire("Error", data.error || "Failed to save user.", "error");
      }
    } catch {
      Swal.fire("Error", "An unexpected error occurred.", "error");
    }
  };

  return (
    <AdminMainLayout>
      <section className="mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>

        <div className="flex items-center space-x-4 mb-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <Button onClick={handleAddUser}>Add User</Button>
        </div>

        <UserTable
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          loading={loading}
        />

        {isDialogOpen && (
          <UserForm
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            formData={formData}
            errors={errors}
            onChange={(e) => {
              const { name, value } = e.target;
              if (name.startsWith("name.")) {
                const key = name.split(".")[1];
                setFormData({
                  ...formData,
                  name: {
                    ...formData.name,
                    first: "",
                    middle: "",
                    last: "",
                    ...formData.name,
                    [key]: value,
                  },
                });
              } else {
                setFormData({ ...formData, [name]: value });
              }
            }}
            onSave={handleSaveUser}
            onCancel={() => setIsDialogOpen(false)}
            onImageUpload={(imageFile) => {
              console.log("Image uploaded:", imageFile);
              // Handle image upload logic here
            }}
          />
        )}
      </section>
    </AdminMainLayout>
  );
}

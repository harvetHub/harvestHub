"use client";

import { useState, useEffect, useCallback } from "react";
import UserTable from "@/components/admin/user/UserTable";
import UserForm from "@/components/admin/user/UserForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/Pagination"; // Ensure you have a Pagination component
import Swal from "sweetalert2";
import { AdminMainLayout } from "@/layout/AdminMainLayout";
import { User } from "@/lib/definitions";
import useAuthCheck from "@/hooks/admin/useAuthCheck";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    user_id: "",
    name: { first: "", middle: "", last: "" },
    username: "",
    email: "",
    address: "",
    mobile_number: "",
    image_url: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

  // Fetch users from the API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10", // Default limit per page
        ...(searchTerm ? { search_term: searchTerm } : {}),
      });

      const response = await fetch(
        `/api/admin/users?${queryParams.toString()}`
      );
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setTotalPages(data.totalPages); // Set total pages from API response
      } else {
        Swal.fire("Error", data.error || "Failed to fetch users", "error");
      }
    } catch {
      Swal.fire("Error", "An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setPage(1); // Reset to the first page when searching
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      user_id: "",
      name: { first: "", middle: "", last: "" },
      username: "",
      email: "",
      address: "",
      mobile_number: "",
      image_url: "",
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
      address: user.address || "",
      mobile_number: user.mobile_number || "",
      image_url: user.image_url || "",
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

  const validateUserForm = (
    formData: User
  ): Partial<Record<keyof User, string>> => {
    const validationErrors: Partial<Record<keyof User, string>> = {};

    // Validate required fields
    if (!formData.username) validationErrors.username = "Username is required.";
    if (!formData.email) validationErrors.email = "Email is required.";
    if (!formData.address) validationErrors.address = "Address is required.";
    if (!formData.mobile_number)
      validationErrors.mobile_number = "Mobile number is required.";

    return validationErrors;
  };

  const handleSaveUser = async () => {
    // Call the validation function
    const validationErrors = validateUserForm(formData);

    // Set errors if validation fails
    setErrors(validationErrors);

    // Stop execution if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("user_id", formData.user_id || "");
      formDataToSend.append("name", JSON.stringify(formData.name));
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("mobile_number", formData.mobile_number || "");

      // Append the image file if it exists
      if (formData.image_url instanceof File) {
        formDataToSend.append("image_url", formData.image_url);
      }

      const response = await fetch("/api/admin/users", {
        method: editingUser ? "PUT" : "POST",
        body: formDataToSend, // Use FormData
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

  // Check if the user is authenticated
  useAuthCheck();

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
          <Button className="cursor-pointer" onClick={handleAddUser}>
            Add User
          </Button>
        </div>

        <UserTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          loading={loading}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
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
                    [key]: value,
                  },
                });
              } else {
                setFormData({ ...formData, [name]: value });
              }
            }}
            onSave={handleSaveUser}
            onCancel={() => setIsDialogOpen(false)}
            onImageUpload={(file) => {
              setFormData({
                ...formData,
                image_url: file,
              });
            }}
          />
        )}
      </section>
    </AdminMainLayout>
  );
}

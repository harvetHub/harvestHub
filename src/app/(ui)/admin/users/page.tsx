"use client";

import { useState, useEffect } from "react";
import UserTable from "@/components/admin/user/UserTable";
import UserForm from "@/components/admin/user/UserForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { AdminMainLayout } from "@/layout/AdminMainLayout";
import { User } from "@/lib/definitions";
import { uploadImageToStorage } from "@/utils/uploadImageToStorage";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
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
      user_id: "",
      name: { first: "", middle: "", last: "" },
      username: "",
      email: "",
      image_url: "",
      address: "",
      mobile_number: "",
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      user_id: user.user_id,
      name: {
        first: user.name?.first || "",
        middle: user.name?.middle || "",
        last: user.name?.last || "",
      },
      username: user.username,
      email: user.email,
      image_url: user.image_url,
      address: user.address || "",
      mobile_number: user.mobile_number || "",
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
      let uploadedImageUrl = formData.image_url;

      // If a new image file is selected, upload it to Supabase Storage
      if (formData.image_url && formData.image_url.startsWith("blob:")) {
        const fileName = `users/${Date.now()}_${
          editingUser?.username || "user"
        }`;
        const bucketName = "user-images"; // Replace with your Supabase bucket name
        uploadedImageUrl = await uploadImageToStorage(
          new File([], formData.image_url), // Replace with actual file
          fileName,
          bucketName
        );
      }

      // Update the formData with the uploaded image URL
      const updatedFormData = { ...formData, image_url: uploadedImageUrl };

      const response = await fetch("/api/admin/users", {
        method: editingUser ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await response.json();

      // Log the results for debugging
      console.log("API Response:", data);

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
    } catch (error) {
      console.error("Error saving user:", error);
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
              const fileName = `users/${Date.now()}_${imageFile.name}`;
              const bucketName = "user-images"; // Replace with your Supabase bucket name
              uploadImageToStorage(imageFile, fileName, bucketName)
                .then((url) => {
                  setFormData({ ...formData, image_url: url });
                })
                .catch((error) => {
                  console.error("Image upload failed:", error);
                  Swal.fire("Error", "Failed to upload image.", "error");
                });
            }}
          />
        )}
      </section>
    </AdminMainLayout>
  );
}

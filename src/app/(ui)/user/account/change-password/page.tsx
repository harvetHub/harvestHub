"use client";

import SideNav from "@/components/user/SideNav";
import { MainLayout } from "@/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const ChangePassPage: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [apiError, setApiError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setApiError("");
    setSuccessMsg("");

    // Validation
    const newErrors: typeof errors = { ...errors };
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required.";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters.";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/change-pass", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setSuccessMsg("Password changed successfully!");
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          setApiError(data.error || "Failed to change password.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setApiError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  const formFields = [
    {
      id: "currentPassword",
      label: "Current Password",
      type: "password",
      placeholder: "Enter your current password",
      value: formData.currentPassword,
      error: errors.currentPassword,
    },
    {
      id: "newPassword",
      label: "New Password",
      type: "password",
      placeholder: "Enter your new password",
      value: formData.newPassword,
      error: errors.newPassword,
    },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm your new password",
      value: formData.confirmPassword,
      error: errors.confirmPassword,
    },
  ];

  return (
    <MainLayout>
      <div className="myContainer flex flex-col md:flex-row gap-6">
        {/* Side Navigation */}
        <SideNav />

        {/* Change Password Form */}
        <Card className="flex-1 bg-white px-4 py-8 rounded-sm shadow border-0 p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formFields.map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  {field.error && (
                    <p className="text-red-500 text-sm mt-1">{field.error}</p>
                  )}
                </div>
              ))}

              {apiError && (
                <div className="text-red-600 text-sm">{apiError}</div>
              )}
              {successMsg && (
                <div className="text-green-600 text-sm">{successMsg}</div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ChangePassPage;

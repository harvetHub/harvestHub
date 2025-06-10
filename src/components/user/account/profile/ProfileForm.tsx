"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/lib/definitions";
import { formFields } from "@/lib/profileConfig";
import Swal from "sweetalert2";

interface ProfileFormProps {
  profile?: User;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    username: profile?.username || "",
    name:
      [profile?.name?.first, profile?.name?.middle, profile?.name?.last]
        .filter(Boolean)
        .join(" ") ||
      (typeof profile?.name === "string" ? profile?.name : "") ||
      "",
    email: profile?.email || "",
    mobile_number: profile?.mobile_number || "",
    gender: profile?.gender || "",
    birthDay: profile?.birthDay
      ? new Date(profile?.birthDay).toISOString().slice(0, 10)
      : "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isChanged, setIsChanged] = useState(false);

  // Populate form data from profile prop
  useEffect(() => {
    if (profile) {
      if (typeof profile.image_url === "string")
        setProfileImage(profile.image_url);
    }
  }, [profile]);

  // Track changes to formData compared to initial profile
  useEffect(() => {
    if (!profile) {
      setIsChanged(false);
      return;
    }
    const initial = {
      username: profile.username || "",
      name:
        [profile.name?.first, profile.name?.middle, profile.name?.last]
          .filter(Boolean)
          .join(" ") ||
        (typeof profile.name === "string" ? profile.name : "") ||
        "",
      email: profile.email || "",
      mobile_number: profile.mobile_number || "",
      gender: profile.gender || "",
      birthDay: profile.birthDay
        ? new Date(profile.birthDay).toISOString().slice(0, 10)
        : "",
      image_url: typeof profile.image_url === "string" ? profile.image_url : "",
    };
    const current = { ...formData, image_url: profileImage || "" };
    setIsChanged(
      Object.keys(initial).some(
        (key) =>
          initial[key as keyof typeof initial] !==
          current[key as keyof typeof current]
      )
    );
  }, [formData, profileImage, profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert("File size exceeds 1 MB. Please upload a smaller file.");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Invalid file type. Please upload a .JPEG or .PNG file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Optionally handle image upload here
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        image_url: profileImage,
      }),
    });
    if (res.ok) {
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "success",
        title: "Profile details successfully updated!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    } else {
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "error",
        title: "Updating profile failed. Please try again.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">My profile</h2>
      <p className="text-sm text-gray-500 mb-6 border-b-1 pb-4">
        Manage and protect your account.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Form */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
          {formFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              {field.type === "select" ? (
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, [field.id]: value })
                  }
                  value={formData[field.id as keyof typeof formData]}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  value={formData[field.id as keyof typeof formData] || ""}
                  onChange={handleChange}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={!isChanged}
          >
            Save
          </Button>
        </form>
        {/* Right Column: Profile Image */}
        <div className="flex flex-col justify-center items-center">
          <div className="w-60 h-60 rounded-full overflow-hidden bg-gray-200">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                width={160}
                height={160}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full rounded-full">
                <UserIcon className="w-40 h-40 opacity-30" />
              </div>
            )}
          </div>

          <input
            type="file"
            id="profileImage"
            accept=".jpeg,.png"
            className="hidden"
            onChange={handleImageChange}
          />
          <label
            htmlFor="profileImage"
            className="mt-4 cursor-pointer inline-block bg-gray-800 text-white text-center py-2 px-4 rounded hover:bg-gray-700"
          >
            Select Image
          </label>
          <p className="text-xs text-gray-500 mt-2">
            File size: maximum 1 MB <br />
            File extension: .JPEG, .PNG
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;

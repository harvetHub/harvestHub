import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/definitions";
import Image from "next/image";
import { useState } from "react";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: User;
  errors: Partial<Record<string, string>>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  formData,
  errors,
  onChange,
  onImageUpload,
  onSave,
  onCancel,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
      onImageUpload(e); // Call the parent handler to handle the file
    }
  };

  const fields = [
    { name: "username", placeholder: "Username", type: "text", colSpan: 1 },
    { name: "name.first", placeholder: "First Name", type: "text", colSpan: 1 },
    {
      name: "name.middle",
      placeholder: "Middle Name",
      type: "text",
      colSpan: 1,
    },
    { name: "name.last", placeholder: "Last Name", type: "text", colSpan: 1 },
    { name: "email", placeholder: "Email", type: "email", colSpan: 1 },
    {
      name: "mobile_number",
      placeholder: "Mobile Number",
      type: "text",
      colSpan: 1,
    },
    { name: "address", placeholder: "Address", type: "text", colSpan: 2 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {formData.user_id ? "Edit User" : "Add User"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {/* Render input fields dynamically */}
          {fields.map((field) => (
            <div
              key={field.name}
              className={field.colSpan === 2 ? "col-span-2" : ""}
            >
              <Input
                name={field.name}
                placeholder={field.placeholder}
                type={field.type}
                value={
                  field.name.startsWith("name.")
                    ? String(
                        formData.name?.[
                          field.name.split(".")[1] as keyof typeof formData.name
                        ] || ""
                      )
                    : String((formData as User)[field.name as keyof User] || "")
                }
                onChange={onChange}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {/* Profile Image */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imagePreview && (
              <Image
                src={imagePreview}
                width={100}
                height={100}
                alt="Uploaded"
                className="mt-4 w-32 h-32 object-cover rounded-md"
              />
            )}
            {errors.profile_image && (
              <p className="text-red-500 text-sm">{errors.profile_image}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;

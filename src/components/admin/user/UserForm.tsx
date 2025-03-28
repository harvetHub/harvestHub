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
import { UserIcon } from "@heroicons/react/20/solid";

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
  const [imagePreview, setImagePreview] = useState<string | null>(
    formData.image_url || null
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Generate a preview URL
      setImagePreview(previewUrl); // Update the image preview
      onImageUpload(e);

      // Update the formData.image_url using the onChange handler
      onChange({
        target: {
          name: "image_url",
          value: previewUrl,
        },
      } as React.ChangeEvent<HTMLInputElement>);
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
      <DialogContent style={{ maxWidth: "800px" }}>
        <DialogHeader>
          <DialogTitle>
            {formData.user_id ? "Edit User" : "Add User"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4">
          {/* Profile Image */}
          <div className="flex justify-center items-center flex-col col-span-1 gap-4 p-4 border border-gray-200 rounded-md shadow-sm">
            <div className="w-40 h-40 bg-gray-100 rounded-full overflow-clip mt-2 flex items-center justify-center border-2 border-gray-200">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  width={100}
                  height={100}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-full h-full object-cover" />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {errors.image_url && (
              <p className="text-red-500 text-sm">{errors.image_url}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 col-span-2">
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
                            field.name.split(
                              "."
                            )[1] as keyof typeof formData.name
                          ] || ""
                        )
                      : String(
                          (formData as User)[field.name as keyof User] || ""
                        )
                  }
                  onChange={onChange}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm">{errors[field.name]}</p>
                )}
              </div>
            ))}

            {/* Actions */}
            <div className="w-full flex justify-center space-x-2 mt-4 col-span-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={onSave}>Save</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;

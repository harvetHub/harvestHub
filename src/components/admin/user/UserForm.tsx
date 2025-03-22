import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/definitions";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: User;
  errors: Partial<Record<keyof User, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  formData,
  errors,
  onChange,
  onSave,
  onCancel,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {formData.user_id ? "Edit User" : "Add User"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* First Name */}
          <Input
            name="name.first"
            placeholder="First Name"
            value={formData.name?.first || ""}
            onChange={onChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          {/* Middle Name */}
          <Input
            name="name.middle"
            placeholder="Middle Name"
            value={formData.name?.middle || ""}
            onChange={onChange}
          />

          {/* Last Name */}
          <Input
            name="name.last"
            placeholder="Last Name"
            value={formData.name?.last || ""}
            onChange={onChange}
          />

          {/* Username */}
          <Input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={onChange}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}

          {/* Email */}
          <Input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={onChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          {/* Role */}
          <Input
            name="role"
            placeholder="Role"
            value={formData.role || ""}
            onChange={onChange}
          />
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;

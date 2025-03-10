import { Input } from "@/components/ui/input";

export const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  icon,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  placeholder: string;
  icon: React.ReactElement;
}) => (
  <div>
    <label htmlFor={id} className="text-base font-medium text-gray-900">
      {label}
    </label>
    <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 h-9 pointer-events-none">
        {icon}
      </div>
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
      />
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    </div>
  </div>
);

export const formFields = [
    { id: "username", label: "Username", type: "text", required: true },
    { id: "name", label: "Name", type: "text", required: true },
    { id: "email", label: "Email", type: "email", required: true },
    {
      id: "mobile_number",
      label: "Mobile Number",
      type: "tel",
      required: true,
    },
    {
      id: "gender",
      label: "Gender",
      type: "select",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ],
      required: true,
    },
    { id: "birthDay", label: "Birthday", type: "date", required: true },
  ];
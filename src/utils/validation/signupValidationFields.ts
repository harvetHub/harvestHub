type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobileNumber: string;
  address: string;
};

type Errors = {
  usernameError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
  mobileNumberError: string;
  addressError: string;
};

export const validateSignupFormData = (formData: FormData): Errors => {
  const errors: Errors = {
    usernameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
    mobileNumberError: "",
    addressError: "",
  };

  if (!formData.username) {
    errors.usernameError = "Username is required";
  }

  if (!formData.email) {
    errors.emailError = "Email is required";
  }

  if (!formData.password) {
    errors.passwordError = "Password is required";
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPasswordError = "Passwords do not match";
  }

  if (!formData.mobileNumber) {
    errors.mobileNumberError = "Phone number is required";
  }

  if (!formData.address) {
    errors.addressError = "Address is required";
  }

  return errors;
};

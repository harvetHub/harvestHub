"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { inputFieldsConfig } from "@/lib/config";
import { InputField } from "@/components/signup/InputField";
import { validateSignupFormData } from "@/utils/validation/signupValidationFields";
import Swal from "sweetalert2";

export default function Signup() {
  type FormDataKeys =
    | "username"
    | "email"
    | "password"
    | "confirmPassword"
    | "mobileNumber"
    | "address";
  type ErrorKeys =
    | "usernameError"
    | "emailError"
    | "passwordError"
    | "confirmPasswordError"
    | "mobileNumberError"
    | "addressError";

  const [formData, setFormData] = useState<Record<FormDataKeys, string>>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<ErrorKeys, string>>({
    usernameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
    mobileNumberError: "",
    addressError: "",
  });
  const [role] = useState("customer");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateSignupFormData(formData);
    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");

    if (isValid) {
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            role,
          }),
        });

        const data = await response.json();

        console.log(data);

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "User signed up successfully",
          });
          // Handle successful signup (e.g., redirect to login page)
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.error,
          });
          // Handle error (e.g., show error message to the user)
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An unexpected error occurred. Please try again later.",
        });
        // Handle error (e.g., show error message to the user)
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please correct the errors in the form.",
      });
    }
  };

  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        <div className="relative flex items-end px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-gray-50 sm:px-6 lg:px-8">
          <div className="absolute inset-0"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24">
          <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
            <h2 className="text-3xl font-bold text-center leading-tight text-black sm:text-4xl">
              Sign up for HarvestHub
            </h2>

            <h3 className="my-4 font-semibold opacity-80 text-center">
              Integrated Online Agricultural Marketplace
            </h3>

            <form onSubmit={handleSignup} className="mt-8">
              <div className="space-y-5">
                {inputFieldsConfig.map((field) => (
                  <InputField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    value={formData[field.id as FormDataKeys]}
                    onChange={handleChange}
                    error={errors[`${field.id}Error` as ErrorKeys]}
                    placeholder={field.placeholder}
                    icon={field.icon}
                  />
                ))}

                <p className="mt-2 text-right text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/"
                    title=""
                    className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline"
                  >
                    Login
                  </Link>
                </p>

                <div>
                  <Button
                    type="submit"
                    className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 cursor-pointer border-transparent rounded-md bg-gradient-to-r from-green-400 to-blue-500 focus:outline-none hover:opacity-80 focus:opacity-80"
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

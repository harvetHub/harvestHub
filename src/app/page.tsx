"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear the error for the field being updated
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { email: "", password: "" };

    // Validate fields
    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            toast: true,
            position: "bottom-end",
            icon: "success",
            title: "User logged in successfully",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          router.push("/dashboard");
        } else {
          Swal.fire({
            toast: true,
            position: "bottom-end",
            icon: "error",
            title: data.error,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
        }
      } catch {
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "error",
          title: "An unexpected error occurred. Please try again later.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
      }
    }
  };

  const fields = [
    {
      name: "email",
      type: "email",
      placeholder: "Enter email to get started",
      label: "Email address",
      icon: (
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
          />
        </svg>
      ),
    },
    {
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      label: "Password",
      icon: (
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        <div className="relative flex items-end px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-gray-50 sm:px-6 lg:px-8">
          <div className="absolute inset-0"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24">
          <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
            <h2 className="text-3xl font-bold text-center leading-tight text-black sm:text-4xl">
              Sign in to HarvestHub
            </h2>

            <h3 className="my-4 font-semibold opacity-80 text-center">
              Integrated Online Agricultural Marketplace
            </h3>

            <form onSubmit={handleLogin} className="mt-8">
              <div className="space-y-5">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="text-base font-medium text-gray-900"
                    >
                      {field.label}
                    </label>
                    <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 h-9 pointer-events-none">
                        {field.icon}
                      </div>
                      <Input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleInputChange}
                        className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                      />
                      {errors[field.name as keyof typeof errors] && (
                        <p className="text-destructive text-sm mt-2">
                          {errors[field.name as keyof typeof errors]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <p className="mt-2 text-right text-gray-600">
                  Don’t have an account?{" "}
                  <Link
                    href="signup"
                    title=""
                    className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline"
                  >
                    Signup
                  </Link>
                </p>

                <Button
                  type="submit"
                  className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 cursor-pointer border-transparent rounded-md bg-gradient-to-r from-green-400 to-blue-500 focus:outline-none hover:opacity-80 focus:opacity-80"
                >
                  Log in
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

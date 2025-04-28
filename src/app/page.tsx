"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Swal from "sweetalert2";
import { loginFields } from "@/lib/loginConfig";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Import shadcn carousel

const carouselImages = [
  { name: "image1", src: "/images/lm1.jpg" },
  { name: "image2", src: "/images/lm2.jpg" },
  { name: "image3", src: "/images/lm3.jpg" },
  { name: "image4", src: "/images/lm4.jpg" },
  { name: "image5", src: "/images/lm5.jpg" },
  { name: "image6", src: "/images/lm6.jpg" },
  { name: "image7", src: "/images/lm7.jpg" },
].map((image) => image.src);

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

  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        {/* Left Side with Carousel */}
        <div className="left relative flex items-center justify-center">
          <Carousel>
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index} className="w-full h-full">
                  <Image
                    width={1000}
                    height={800}
                    src={image}
                    alt={`Carousel Image ${index + 1}`}
                    className="w-full h-screen object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              variant={"default"}
              size={"lg"}
              className="ml-20 scale-130 hover:scale-150 cursor-pointer animate-pulse"
            />
            <CarouselNext
              variant={"default"}
              size={"lg"}
              className="mr-20 scale-130 hover:scale-150 cursor-pointer animate-pulse"
            />
          </Carousel>
        </div>

        {/* Right Side with Login Form */}
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
                {loginFields.map((field) => (
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

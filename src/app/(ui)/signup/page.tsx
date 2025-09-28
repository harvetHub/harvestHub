"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { inputFieldsConfig } from "@/lib/signupConfig";
import { InputField } from "@/components/signup/InputField";
import { validateSignupFormData } from "@/utils/validation/signupValidationFields";
import Swal from "sweetalert2";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const carouselImages = [
  { name: "image1", src: "/images/lm1.jpg" },
  { name: "image2", src: "/images/lm2.jpg" },
  { name: "image3", src: "/images/lm3.jpg" },
  { name: "image4", src: "/images/lm4.jpg" },
  { name: "image5", src: "/images/lm5.jpg" },
  { name: "image6", src: "/images/lm6.jpg" },
  { name: "image7", src: "/images/lm7.jpg" },
  { name: "image8", src: "/images/lm8.jpg" },
  { name: "image9", src: "/images/lm9.jpg" },
  { name: "image10", src: "/images/lm10.jpg" },
].map((image) => image.src);

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

  const router = useRouter();

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
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "User signed up successfully",
          });
          router.push("/login");
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
        {/* Left Side with Carousel */}
        <div className="relative flex items-center justify-center bg-gradient-to-r lg:h-full">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index} className="w-full h-full">
                  <Image
                    width={1000}
                    height={800}
                    src={image}
                    alt={`Carousel Image ${index + 1}`}
                    className="h-[40vh] w-full lg:h-screen object-cover object-center"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              variant={"default"}
              size={"lg"}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 scale-125 hover:scale-150 cursor-pointer animate-pulse"
            />
            <CarouselNext
              variant={"default"}
              size={"lg"}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 scale-125 hover:scale-150 cursor-pointer animate-pulse"
            />
          </Carousel>
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
                    href="/login"
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

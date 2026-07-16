"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { signIn } from "next-auth/react";
import Link from "next/link";

const SignIn = () => {
  //eslint-disable-next-line
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  type SignInValue = z.infer<typeof signInSchema>;
  const register = useForm<SignInValue>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignInValue> = async (data) => {
    const response = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (response?.error) {
      toast.error(response.error || "Login failed", {
        position: "bottom-right",
        style: {
          background: "#ef4444", // Vibrant Red (Tailwind Red-500)
          color: "#ffffff", // White text for contrast
          fontWeight: "500",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
        },
      });
    }

    if (response?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl text-black font-extrabold tracking-tight lg:text-5xl mb-6">
            SafeSpeak
          </h1>
          <p className="mb-4 text-gray-400">
            Log in to start your anonymous adventure
          </p>
        </div>
        <form className="space-y-6" onSubmit={register.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="identifier"
              control={register.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-black font-bold text-lg"
                  >
                    Email / Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Email/Username"
                    className="px-2.5 py-5 border border-gray-400 rounded-lg bg-slate-100 transition-all ease placeholder-slate-400 text-sm text-black"
                    autoComplete="off"
                    onChange={(e) => {
                      field.onChange(e);
                      // setUsername(e.target.value);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={register.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-black font-bold text-lg"
                  >
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
                    className="px-2.5 py-5 border border-gray-400 rounded-lg bg-slate-100 transition-all ease placeholder-slate-400 text-sm text-black"
                    autoComplete="off"
                    onChange={(e) => {
                      field.onChange(e);
                      // setUsername(e.target.value);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Button type="submit" className="w-full p-4.5 mt-6 cursor-pointer">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
        <div className="text-center mt-4">
          <p>
            Don&apos;t have account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

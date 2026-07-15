"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@base-ui/react/input";
import { signUpSchema } from "@/schemas/signUpSchema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useDebounceValue } from "usehooks-ts";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type SignUpValues = z.infer<typeof signUpSchema>;

const Page = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [debouncedUsername, setValue] = useDebounceValue(username, 500);
  const router = useRouter();

  // Zod implementation
  const register = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response: AxiosResponse<ApiResponse> = await axios.get(
            "/api/check-username-unique",
            {
              params: {
                username: debouncedUsername,
              },
            },
          );

          setUsernameMessage(response.data.message);
        } catch (error: AxiosError<ApiResponse> | unknown) {
          if (error instanceof AxiosError) {
            console.error(
              "An unexpected error occured: ",
              error.response?.data?.message,
            );
            setUsernameMessage(
              error?.response?.data?.message ?? "Error in checking username",
            );
          } else {
            console.error("An unexpected error occured: ", error);
            setUsernameMessage("Error in checking username");
          }
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit: SubmitHandler<SignUpValues> = async (data: SignUpValues) => {
    setIsSubmitting(true);
    try {
      console.log(data); // TODO: Test console to be removed.
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "User registered successfully, Please verify email!",
          {
            position: "bottom-right",
          },
        );
      }

      // Redirect to verification page
      router.replace(`/verify${username}`);
    } catch (error: AxiosError<ApiResponse> | unknown) {
      if (error instanceof AxiosError) {
        console.error(
          "An unexpected error occured: ",
          error.response?.data.message,
        );
        toast.error(error.response?.data.message || "Something went wrong");
      } else {
        toast.error("Something went wrong", {
          position: "bottom-right",
          style: {
            background: "#ef4444", // Vibrant Red (Tailwind Red-500)
            color: "#ffffff", // White text for contrast
            fontWeight: "500",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)", // Red-tinted shadow
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl text-black font-extrabold tracking-tight lg:text-5xl mb-6">
            Join SafeSpeak
          </h1>
          <p className="mb-4 text-gray-400">
            Sign up to start your anonymous adventure
          </p>
        </div>
        <form id="space-y-6" onSubmit={register.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={register.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-black font-bold text-lg"
                  >
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Username"
                    className="p-2.5 border border-gray-400 rounded-lg bg-slate-100 transition-all ease placeholder-slate-400 text-sm text-black"
                    autoComplete="off"
                    onChange={(e) => {
                      field.onChange(e);
                      // setUsername(e.target.value);
                      setValue(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is available"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={register.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-black font-bold text-lg"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Email"
                    autoComplete="off"
                    className="p-2.5 border border-gray-400 rounded-lg bg-slate-100 transition-all ease placeholder-slate-400 text-sm text-black"
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
                    type="password"
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
                    autoComplete="off"
                    className="p-2.5 border border-gray-400 rounded-lg bg-slate-100 transition-all ease placeholder-slate-400 text-sm text-black"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Button
            type="submit"
            className="w-full p-4.5 mt-6 cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

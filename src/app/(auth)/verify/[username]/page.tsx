"use client"

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const VerifyAccount = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const params = useParams<{ username: string }>();

  type verifyValue = z.infer<typeof verifySchema>;

  const register = useForm<verifyValue>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  // Function to handle submit.
  const onSubmit: SubmitHandler<verifyValue> = async (data) => {
    try {
      setIsSubmitting(true);
      const response: AxiosResponse<ApiResponse> = await axios.post(
        "/api/verify-code",
        {
          username: params?.username,
          code: data.code,
        },
      );

      toast.success(response.data.message || "Account verified successfully", {
        position: "bottom-left",
      });

      router.replace("/sign-in");
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
            Verify Account
          </h1>
          <p className="mb-4 text-gray-400">
            Enter the verification code sent to your email.
          </p>
        </div>
        <form className="space-y-4" onSubmit={register.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="code"
              control={register.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-black font-bold text-lg"
                  >
                    Verification Code
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="XXXXXX"
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
              "Verify"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;

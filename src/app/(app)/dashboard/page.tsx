"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type acceptMessageValues = z.infer<typeof acceptMessageSchema>;

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

  const handleDeleteMessage = (messageId: string | unknown) => {
    setMessages(messages.filter((item) => item._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm<acceptMessageValues>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: true,
    },
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response: AxiosResponse<ApiResponse> = await axios.get(
        "/api/accept-messages",
      );
      setValue("acceptMessages", response.data.isAcceptingMessages as boolean);
    } catch (error: AxiosError<ApiResponse> | unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message || "Something went wrong");
        toast.error(
          error.response?.data.message ||
            "Something went wrong to get message acceptance status!",
          {
            position: "bottom-right",
          },
        );
        return;
      }

      toast.error("Something went wrong to get message acceptance status!", {
        position: "bottom-right",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);

      try {
        const response: AxiosResponse<ApiResponse> =
          await axios.get("/api/get-messages");
        setMessages(response.data.messages || []);

        if (refresh) {
          toast.info("Showing latest messages!", {
            position: "bottom-right",
          });
        }
      } catch (error: AxiosError<ApiResponse> | unknown) {
        if (error instanceof AxiosError) {
          console.error(error.response?.data.message || "Something went wrong");
          toast.error(
            error.response?.data.message ||
              "Something went wrong to get messages!",
            {
              position: "bottom-right",
            },
          );
          return;
        }

        toast.error("Something went wrong to get messages!", {
          position: "bottom-right",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages],
  );

  useEffect(() => {
    if (!session || !session?.user) return;

    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        "/api/accept-messages",
        {
          acceptMessages: !acceptMessages,
        },
      );

      setValue("acceptMessages", !acceptMessages);

      toast.info(response.data.message || "Message acceptance status toggled!");
    } catch (error: AxiosError<ApiResponse> | unknown) {
      if (error instanceof AxiosError) {
        console.error(
          error.response?.data.message ||
            "Failed to toggle the message acceptance status!",
        );
        toast.error(
          error.response?.data.message ||
            "Failed to toggle the message acceptance status!",
        );
        return;
      }
      
    toast.error("Failed to toggle the message acceptance status!");
    }
  };

  if (!session || !session?.user) return <>Please login</>;

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Url copied!");
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

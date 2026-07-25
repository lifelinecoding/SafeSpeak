"use client";

import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError, AxiosResponse } from "axios";
import { use, useState } from "react";
import { toast } from "sonner";
// import Router from 'next/router'

const MessagePage = ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = use(params);
  const [Message, setMessage] = useState<string | undefined>("");

  const sendMessage = async () => {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        "/api/send-messages",
        {
          username,
          content: Message?.trim(),
        },
      );

      toast.info(response.data.message || "Message sent successfully", {
        position: "bottom-right",
      });
    } catch (error: AxiosError<ApiResponse> | unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
        toast.error(error.response?.data.message || "Failed to send message", {
          position: "bottom-right",
        });
        return;
      }

      toast.error("Failed to send message", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">Send Your Feedback</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">
          Your identity is our responsibility
        </h2>{" "}
        <div className="flex items-center flex-col h-full">
          <textarea
            value={Message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please provide your honest feedback."
            className="textarea textarea-bordered w-full h-[50vh] px-3 py-4 bg-white border rounded-md resize-y focus:outline-none focus:ring focus:ring-black"
          />
          <Button
            onClick={sendMessage}
            className="px-4 py-6 w-full mt-6 text-xl cursor-pointer"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;

"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import React from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

//eslint-disable-next-line
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

  async function handleDeleteConfirm() {
     try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message || "Message deleted successfully!",{
        position : "bottom-right",
      });
      onMessageDelete(message._id.toString());

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to delete message',{
        position : "bottom-right"
      })
    } 
  }

  return (
    <Card className="flex w-xs">
      <CardHeader>
        <CardTitle className="font-bold text-lg">Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{message.content}</p>
      </CardContent>

      <AlertDialog>
        <AlertDialogTrigger render={<Button className="w-20 ml-3 bg-black hover:bg-slate-600 hover:text-white text-white cursor-pointer" variant="outline" />}>
          <Trash className="w-5 h-5" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              message from server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default MessageCard;

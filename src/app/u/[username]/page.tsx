"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { Message } from "@/model/User";
import { messageSchema } from "@/schemas/messageSchema";
import { ZodError } from "zod";

interface Props {
  params: { username: string };
}
const page = ({ params }: Props) => {
  const [messageContent, setMessageContent] = useState<string>("");
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const username = params.username;

  const validateMessage = () => {
    try {
      messageSchema.parse({ content: messageContent });
      setValidationErrors([]);
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        setValidationErrors(error.errors.map((err) => err.message));
      }
      return false;
    }
  };
  const handleSubmit = async () => {
    if (!validateMessage()) return;
    setIsSubmittingMessage(true);
    try {
      const response = await axios.post(`/api/send-messages/${username}`, {
        content: messageContent,
      });
      toast.success("Message Sent ", {
        description: (
          <span className="text-green-500 bg-white">
            Message has been sent to the {username}
          </span>
        ),
      });
      setMessageContent("");
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data.message || "Failed to send message";
        toast.error("Error", {
          description: (
            <span className="text-red-500 bg-white">{errorMessage}</span>
          ),
        });
      }else{
        toast.error("Error", {
          description: (
            <span className="text-red-500 bg-white">
              An unexpected error occurred
            </span>
          ),
        });
      }
    }finally{
      setIsSubmittingMessage(false)
    }
    setIsSubmittingMessage(false);
  };
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <h1 className="text-5xl mt-11 font-bold mb-4">Public Profile Link</h1>
        </div>
        <div className="flex-col items-center justify-center  mt-6">
          <h2 className="mb-3 font-medium">
            Send anonymous message to {username}
          </h2>
          <Textarea
            placeholder="write your message here"
            className="w-3xl mb-2"
            value={messageContent}
          />
        </div>
        <Button onClick={handleSubmit} className="px-6 mt-3">
          Submit
        </Button>
      </div>
    </>
  );
};

export default page;

import z from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Content must be atleast of 10 chracters")
    .max(300, "Content sgould not me more than 300 characters"),
});

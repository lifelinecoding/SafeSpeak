import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    // Check if user is accepting the message!
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the messages",
        },
        {
          status: 403, // Forbidden
        },
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully!",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Internal server error:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send message!",
      },
      {
        status: 500,
      },
    );
  }
}

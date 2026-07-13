import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database!");
    return;
  }

  try {
    const connectionInstance = await mongoose.connect(
      (process.env.MONGODB_URI as string) || "",
      {},
    );
    connection.isConnected = connectionInstance.connections[0].readyState;
    console.log(
      "DB connected successfully",
      connectionInstance.connection.host,
    );
  } catch (error) {
    console.error("Database connection failed: ", error);
    process.exit(1);
  }
}

export { dbConnect };

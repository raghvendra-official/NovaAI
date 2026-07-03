import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    role: ["user", "assistant"],
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ThreadSchema = new mongoose.Schema({
  threadId: {
    type: String,
    require: true,
    unique: true,
  },
  title: {
    type: String,
    require: true,
    default: "New Chat",
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    require: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    require: true,
    default: Date.now,
  },
});

export default mongoose.model("Thread", ThreadSchema);

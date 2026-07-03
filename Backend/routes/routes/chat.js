import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utlis/gemini.js";

const router = express.Router();

// Test
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "xyz2fe",
      title: "Testing New Thread",
    });

    const response = await thread.save();

    res.status(201).json({
      message: "Thread saved successfully",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

//Get all threads on left side pannel
router.get("/thread", async (req, res) => {
  try {
    const thread = await Thread.find({}).sort({ updatedAt: -1 });
    //descending order of updatedAt //most recent data on top
    res.json(thread);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

//To open a paticular chat from history
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread is not found" });
    }

    res.json(thread.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

//to delete the thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deleteThread = await Thread.findOneAndDelete({ threadId });

    if (!deleteThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

//for fetch information from gemini api
router.post("/chat", async (req, res) => {
  const { threadId } = req.body;
  const message = req.body.message?.trim();
  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required field" });
  }
  try {
    let thread = await Thread.findOne({ threadId });
    //adding message asked by user in DB
    if (!thread) {
      //Create a new thread in DB  (means new chat)
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    //API call for respone
    const assistantReply = await getGeminiAPIResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();


    //sending response to frontend
    res.json({ reply: assistantReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Please try again (API facing high traffic)" });
  }
});

export default router;

import "./styles/ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { BeatLoader } from "react-spinners";


function ChatWindow() {
  const {
    prompt,
    setPrompt,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    const message = prompt.trim();
    if (!message || loading) return;

    setLoading(true);
    setNewChat(false);
    setPrompt("");
    setReply(null);
    setPrevChats((prevChats) => [
      ...prevChats,
      {
        role: "user",
        content: message,
      },
    ]);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        threadId: currThreadId,
      }),
    };
    try {
      const response = await fetch("https://novaai-ibv5.onrender.com/api/chat", options);
      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || "Unable to get a response right now.");
      }
      setReply(res.reply);
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "assistant",
          content: res.reply,
        },
      ]);
    } catch (error) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "assistant",
          content: error.message || "Something went wrong. Please try again.",
        },
      ]);
      setReply(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          Nova AI <i className="fa-solid fa-angle-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan</div>
          <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
          <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Logout</div>
        </div>
      )}
      <Chat />

<div className="chatInput">

  {loading && (
    <div className="thinking">
      <span>Nova AI is thinking...</span>

      <BeatLoader
        color="#3B82F6"
        size={8}
      />
    </div>
  )}

  <div className="inputBox"></div>
        <div className="inputBox">
          <input
            type="text"
            placeholder="Ask anything"
            value={prompt}
            disabled={loading}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></input>
          <button id="submit" onClick={getReply} disabled={loading || !prompt.trim()} aria-label="Send message">
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p className="info">
          Nova AI can make mistakes. Check important info. See Cookie
          Preference.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;

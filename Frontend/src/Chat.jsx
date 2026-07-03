import "./styles/Chat.css";
import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown"; //formatting
import rehypeHighlight from "rehype-highlight"; //code
import "highlight.js/styles/github-dark.css"; //get code highlighted more



function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const chatsEndRef = useRef(null);
  const shouldAnimateReply =
    Boolean(reply) && prevChats[prevChats.length - 1]?.content === reply;
  const animatedReply =
    shouldAnimateReply && reply.startsWith(latestReply || "") ? latestReply : "";

  useEffect(() => {
    if (!shouldAnimateReply) return;

    //separating latest reply for typing effect
    const content = reply.split(" "); //individual words are getting store

    let idx = 0;
    let interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));

      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [reply, shouldAnimateReply]);

  useEffect(() => {
    chatsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, latestReply]);

  const chatsToRender =
    shouldAnimateReply && latestReply !== null
      ? prevChats.slice(0, -1)
      : prevChats;

  return (
    <>
      {newChat && <h1>Start a new Chat!</h1>}
      <div className="chats">
        {chatsToRender?.map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "geminiDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {prevChats?.length > 0 && shouldAnimateReply && (
          <div className="geminiDiv" key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {animatedReply}
            </ReactMarkdown>
          </div>
        )}

        <div ref={chatsEndRef} />
      </div>
    </>
  );
}

export default Chat;

import "./styles/Chat.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown"; //formatting
import rehypeHighlight from "rehype-highlight"; //code
import "highlight.js/styles/github-dark.css"; //get code highlighted more

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null); //prev chat load
      return;
    }
    //separating latest reply for typing effect
    if (!prevChats?.length) return;

    const content = reply.split(" "); //individual words are getting store

    let idx = 0;
    let interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));

      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);
  return (
    <>
      {newChat && <h1>Start a new Chat!</h1>}
      <div className="chats">
        {prevChats?.slice(0, -1).map((chat, idx) => (
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

        {prevChats?.length > 0 && latestReply !== null && (
          <div className="geminiDiv" key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply}
            </ReactMarkdown>
          </div>
        )}

        {prevChats?.length > 0 && latestReply === null && (
          <div className="geminiDiv" key={"non-typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {prevChats[prevChats.length - 1].content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;

import "./styles/Sidebar.css";
import logo from "./assets/logo.png"; // Adjust the path if needed
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v4 as uuidv4 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("https://novaai-ibv5.onrender.com/api/thread");
      const res = await response.json();
      const filterData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      console.log(filterData);
      setAllThreads(filterData);
      //threadId, title
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv4());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `https://novaai-ibv5.onrender.com/api/thread/${newThreadId}`,
      );
      const res = await response.json();
      //console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (error) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`https://novaai-ibv5.onrender.com/api/thread/${threadId}`, {
        method: "DELETE",
      });

      const res = await response.json();
      console.log(res);

      //updated thread re-render
      setAllThreads(prev=> prev.filter(thread =>thread.threadId !== threadId));

      if(threadId === currThreadId){
        createNewChat();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="sidebar">
      {/* New Chat Button */}
      <button onClick={createNewChat}>
        <img className="logo" src={logo} alt="NovaAI logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/* History */}
      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx} onClick={(e) => changeThread(thread.threadId)}
          className={thread.threadId === currThreadId? "highlighted": ""}>
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation(); //stopped event bubbnling
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/* Signature */}
      <p className="sign">by Raghvendra Pandey &hearts;</p>
    </section>
  );
}

export default Sidebar;

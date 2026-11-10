
import React, { useContext, useState, useEffect } from "react";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { ChatContext } from "./MyContext.jsx";
import { ScaleLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";

const ChatWindow = () => {
  const [loading, setLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigate = useNavigate();

  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChat,
    user,
    setUser,
  } = useContext(ChatContext);

  const getReply = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || "Failed to get reply");
      }

      setReply(res.reply);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChat((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);

      setPrompt("");
    }
  }, [reply]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      setShowUserMenu(false);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="chatwindow">
      <div className="navbar">
        <span>
          SigmaGPT <i className="fa-solid fa-angle-down"></i>
        </span>

        <div className="userMenuContainer">
          <button
            type="button"
            className="userIconDiv"
            onClick={() => setShowUserMenu((prev) => !prev)}
            aria-label="Open user menu"
          >
            <span className="userIcon">
              <i className="fa-solid fa-user"></i>
            </span>
            {user?.name && (
              <span className="navbarUsername">{user.name}</span>
            )}
            <i className="fa-solid fa-angle-down"></i>
          </button>

          {showUserMenu && (
            <div className="userDropdown">
              {user ? (
                <>
                  <div className="userDetails">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>

                  <button
                    type="button"
                    className="dropdownButton"
                    onClick={handleLogout}
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <Chat />

      <ScaleLoader
        className="loader"
        loading={loading}
        color="#fff"
      />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") getReply();
            }}
          />

          <div className="send">
            <i
              onClick={getReply}
              className="fa-solid fa-paper-plane"
            ></i>
          </div>
        </div>

        <p className="Info">
          SigmaGPT can make mistakes. Check important info.
          See Cookie Preferences.
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;

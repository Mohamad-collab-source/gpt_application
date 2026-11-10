
import { createContext, useState, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";

export const ChatContext = createContext(null);

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ChatProvider = ({ children }) => {
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currThreadId, setCurrThreadId] = useState(uuidv1());
    const [prevChat, setPrevChat] = useState([]);
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);

    // Authentication states
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Check login status when application loads
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(
                    `${VITE_API_URL}/api/auth/me`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    setUser(null);
                    return;
                }

                const data = await response.json();

                if (data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }

            } catch (error) {
                console.error("Authentication check failed:", error);
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Logout
    const logout = async () => {
        try {
            await fetch(
                `${VITE_API_URL}/api/auth/logout`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
            localStorage.removeItem("token");
        }
    };

    return (
        <ChatContext.Provider
            value={{
                prompt,
                setPrompt,
                reply,
                setReply,
                currThreadId,
                setCurrThreadId,
                prevChat,
                setPrevChat,
                newChat,
                setNewChat,
                allThreads,
                setAllThreads,
                user,
                setUser,
                authLoading,
                logout,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOBILE_WIDTH } from "src/data/const";
import ChatList from "src/features/chat/components/list/ChatList";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import ChatWindow from "src/features/chat/components/sections/ChatWindow";
import "./chat-page.scss";

export default function ChatPage() {
  const { globalUser, loadingUser } = useAuthContext();
  const { setIsCollapsed, setActiveChatId, setActiveChatUser, readMessage } =
    useChatContext();

  const [mounted, setMounted] = useState(false);
  const [chatWindowKey, setChatWindowKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (loadingUser) {
        return;
      }

      if (!globalUser) {
        navigate("/auth");
      }
    };

    fetchUser();

    // Clean up state when user leaves page
    return () => {
      if (!mounted) {
        setMounted(true);
        return;
      }

      setIsCollapsed(false);
      setActiveChatId(-1);
      setActiveChatUser({});
      setChatWindowKey(0);
    };
  }, [globalUser, loadingUser, mounted]);

  async function handleOpenChat(chat) {
    setActiveChatUser(chat);
    setActiveChatId(chat.chatId);
    setChatWindowKey(chat.chatId);

    // Collapse sidebar on mobile
    if (window.innerWidth <= MOBILE_WIDTH) {
      setIsCollapsed(true);
    }

    await readMessage(chat.chatId, globalUser.uid);
  }

  if (!globalUser) {
    return null;
  }

  return (
    <section className="chat">
      <ChatList handleOpenChat={handleOpenChat} />
      <ChatWindow key={chatWindowKey} />
    </section>
  );
}

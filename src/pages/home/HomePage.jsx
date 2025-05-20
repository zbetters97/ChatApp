import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatList from "src/features/chat/components/list/ChatList";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "src/features/chat/context/ChatContext";
import ChatWindow from "src/features/chat/components/sections/ChatWindow";
import "./home-page.scss";

export default function Home() {
  const { globalUser, loadingUser } = useAuthContext();
  const { setActiveChatId, setActiveChatUser, setIsCollapsed, readMessage } =
    useChatContext();

  const [chatWindowKey, setChatWindowKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (loadingUser) {
        return;
      }

      if (!globalUser) {
        navigate("/authenticate");
      }
    };

    fetchUser();
  }, [globalUser, loadingUser]);

  async function handleOpenChat(chat) {
    setActiveChatUser(chat);
    setActiveChatId(chat.chatId);
    setChatWindowKey(chat.chatId);

    await readMessage(chat.chatId, globalUser.uid);
  }

  return (
    <section className="home">
      <ChatList handleOpenChat={handleOpenChat} />
      <ChatWindow key={chatWindowKey} />
    </section>
  );
}

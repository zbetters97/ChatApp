import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { db } from "src/config/firebase.js";
import { doc, onSnapshot } from "firebase/firestore";
import { useChatContext } from "src/features/chat/context/ChatContext.js";
import { useAuthContext } from "src/features/auth/context/AuthContext.js";
import { useThemeContext } from "src/features/theme/context/ThemeContext.js";
import Navbar from "./navbar/Navbar.jsx";
import "./layout.scss";

export default function Layout() {
  const { globalUser } = useAuthContext();
  const { chats, getUnreadChatsByUserId } = useChatContext();
  const { theme } = useThemeContext();

  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (!globalUser) {
      setUnreadMessages(0);
      return;
    }

    const unsubscribeChats = onSnapshot(
      doc(db, "userchats", globalUser.uid),
      async () => {
        const chatCount = await getUnreadChatsByUserId(globalUser.uid);
        setUnreadMessages(chatCount);
      }
    );

    return () => {
      unsubscribeChats();
    };
  }, [globalUser, chats]);

  return (
    <div className={`wrapper wrapper--${theme}`}>
      <main className={`main main--${theme}`}>
        <Navbar unreadMessages={unreadMessages} />
        <Outlet />
      </main>
    </div>
  );
}

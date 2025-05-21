import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useChatContext } from "src/features/chat/context/ChatContext";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import ChatCard from "../cards/ChatCard";
import "./chat-list.scss";

export default function ChatList({ handleOpenChat }) {
  const { theme } = useThemeContext();

  return (
    <section className={`chatlist chatlist--${theme}`}>
      <Header />
      <Chats handleOpenChat={handleOpenChat} />
    </section>
  );
}

function Header() {
  const { theme } = useThemeContext();

  return (
    <div className={`chatlist__header chatlist__header--${theme}`}>
      <h2>All chats</h2>
      <Compose />
    </div>
  );
}

function Compose() {
  const { globalUser } = useAuthContext();
  const { setActiveChatId, activeChatUser, setActiveChatUser } =
    useChatContext();
  const { theme } = useThemeContext();

  async function handleNewChat() {
    if (!activeChatUser || !globalUser) return;
    setActiveChatId(-1);
    setActiveChatUser({});
  }

  return (
    <button
      type="button"
      onClick={handleNewChat}
      className={`chatlist__compose chatlist__compose--${theme}`}
    >
      <FontAwesomeIcon icon={faPenToSquare} />
    </button>
  );
}

function Chats({ handleOpenChat }) {
  const { chats } = useChatContext();

  return (
    <div className="chatlist__chats">
      {chats &&
        chats.length > 0 &&
        chats.map((chat) => {
          return (
            <ChatCard
              key={chat.chatId}
              chat={chat}
              handleOpenChat={handleOpenChat}
            />
          );
        })}
    </div>
  );
}

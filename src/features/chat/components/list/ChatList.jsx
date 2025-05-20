import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useChatContext } from "src/features/chat/context/ChatContext";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import ChatCard from "../cards/ChatCard";
import "./chat-list.scss";

export default function ChatList({ handleOpenChat }) {
  return (
    <section className="chatlist">
      <Header />
      <Chats handleOpenChat={handleOpenChat} />
    </section>
  );
}

function Header() {
  return (
    <div className="chatlist__header">
      <h2>All chats</h2>
      <Compose />
    </div>
  );
}

function Compose() {
  const { globalUser } = useAuthContext();
  const { setActiveChatId, activeChatUser, setActiveChatUser } =
    useChatContext();

  async function handleNewChat() {
    if (!activeChatUser || !globalUser) return;
    setActiveChatId(-1);
    setActiveChatUser({});
  }

  return (
    <button type="button" onClick={handleNewChat} className="chatlist__compose">
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

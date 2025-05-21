import { useChatContext } from "src/features/chat/context/ChatContext";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import "./chat-card.scss";

export default function ChatCard({ chat, handleOpenChat }) {
  const { activeChatUser } = useChatContext();
  const { theme } = useThemeContext();

  const isActive = activeChatUser.uid === chat.uid;

  const lastMessage =
    chat.lastMessage.length > 40
      ? `${chat.lastMessage.slice(0, 40)}...`
      : chat.lastMessage;

  return (
    <div
      aria-selected={isActive}
      onClick={() => handleOpenChat(chat)}
      className={`chat-card chat-card--${theme}`}
    >
      <p className="chat-card__username">{chat.displayname}</p>
      <p className="chat-card__message">{lastMessage}</p>
      {chat.unread > 0 && <span className={`chat-card__unread`} />}
    </div>
  );
}

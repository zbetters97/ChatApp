import { getTimeSinceShort } from "src/utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import { faThumbTack, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import SettingsButton from "../buttons/SettingsButton";
import { useChatContext } from "../../context/ChatContext";
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
      onClick={() => handleOpenChat(chat)}
      className={`chat-card chat-card--${theme}`}
      aria-selected={isActive}
    >
      {chat.pinned && (
        <FontAwesomeIcon icon={faThumbTack} className="chat-card__pin" />
      )}

      <FontAwesomeIcon icon={faUserCircle} className="chat-card__icon" />

      <div className="chat-card__info">
        <div className="chat-card__header">
          <p className="chat-card__username">{chat.displayname}</p>
          <p className="chat-card__time">
            {getTimeSinceShort(chat.updatedAt.toDate())}
          </p>
        </div>
        <p className="chat-card__message">{lastMessage || "No messages"}</p>
        {chat.unread > 0 && <span className={`chat-card__unread`} />}
      </div>

      <SettingsButton chat={chat} />
    </div>
  );
}

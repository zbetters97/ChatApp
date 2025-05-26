import { formatTime } from "src/utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import { useChatContext } from "../../context/ChatContext";
import "./message-card.scss";

export default function MessageCard({ message, messages, index }) {
  const { globalUser } = useAuthContext();
  const { theme } = useThemeContext();

  const isCurrentUser = message.senderId === globalUser.uid;

  /* If message is liked, check if either...
    ...it's a different sender than the previous message OR
    ...it's shorter than the previous message by at least 3 characters
    If neither, don't add padding-top */
  const isLiked =
    message.isLiked &&
    (message.senderId !== messages[index - 1]?.senderId ||
      message.text.length <= messages[index - 1]?.text.length + 2)
      ? "liked"
      : "unliked";

  function handleClick(e) {
    // Reveal heart or delete button
    e.target.parentNode.classList.add("bubble--clicked");

    // Hide heart or delete button after 2 seconds
    setTimeout(() => {
      e.target.parentNode.classList.remove("bubble--clicked");
    }, 2000);
  }

  return (
    <div
      className={`message message--${
        isCurrentUser ? "user" : "friend"
      } message--${isLiked}`}
    >
      <MessageTime message={message} />

      {message.isDeleted ? (
        <p className={`message__deleted message__deleted--${theme}`}>
          This message was deleted
        </p>
      ) : (
        <div
          onClick={handleClick}
          className={`bubble bubble--${theme} bubble--${
            isCurrentUser ? "user" : "friend"
          }`}
        >
          {isCurrentUser && !message.isDeleted && (
            <MessageDeleteButton
              message={message}
              isCurrentUser={isCurrentUser}
            />
          )}

          {!message.isDeleted && (
            <MessageLikeButton
              message={message}
              isCurrentUser={isCurrentUser}
            />
          )}

          <MessageText message={message} />
        </div>
      )}
    </div>
  );
}

function MessageTime({ message }) {
  return (
    <p className="message__time">{formatTime(message.createdAt.toDate())}</p>
  );
}

function MessageDeleteButton({ message, isCurrentUser }) {
  const { globalUser } = useAuthContext();
  const { deleteMessage, activeChatUser } = useChatContext();

  async function handleDelete() {
    if (!isCurrentUser) return;

    await deleteMessage(
      message.id,
      message.chatId,
      activeChatUser.uid,
      globalUser.uid
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="bubble__button bubble__delete"
      aria-label="delete message"
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );
}

function MessageLikeButton({ message, isCurrentUser }) {
  const { likeMessage } = useChatContext();
  const { theme } = useThemeContext();

  const isLiked = message.isLiked ? "liked" : "unliked";
  const position = isCurrentUser ? "user" : "friend";

  async function handleLike() {
    if (isCurrentUser) return;
    await likeMessage(message.id, message.chatId, !message.isLiked);
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      className={`bubble__button bubble__like bubble__like--${theme} bubble__like--${isLiked} bubble__like--${position}`}
      aria-label="like message"
    >
      <FontAwesomeIcon icon={faHeart} />
    </button>
  );
}

function MessageText({ message }) {
  return <p className="bubble__text">{message.text}</p>;
}

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import "./new-message.scss";

export default function MessageInput() {
  const { globalUser } = useAuthContext();
  const { activeChatId, activeChatUser, sendMessage } = useChatContext();

  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = inputRef?.current.value.trim();
    if (!globalUser || !activeChatId || !activeChatUser || message === "") {
      return;
    }

    inputRef.current.value = "";

    await sendMessage(
      activeChatId,
      globalUser.uid,
      activeChatUser.uid,
      message
    );
  };

  return (
    <form onSubmit={handleSubmit} className="new-message">
      <input type="text" ref={inputRef} className="new-message__input" />
      <button type="submit" className="new-message__button">
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
}

import { useRef, useState } from "react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import "./new-message.scss";

export default function MessageInput() {
  const { globalUser } = useAuthContext();
  const { activeChatId, activeChatUser, sendMessage } = useChatContext();

  const [active, setActive] = useState(false);

  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = inputRef?.current.value.trim();
    if (!globalUser || !activeChatId || !activeChatUser || message === "") {
      return;
    }

    inputRef.current.value = "";
    setActive(false);

    await sendMessage(
      activeChatId,
      globalUser.uid,
      activeChatUser.uid,
      message
    );
  };

  return (
    <form onSubmit={handleSubmit} className="new-message">
      <FormInput inputRef={inputRef} setActive={setActive} />
      <SubmitButton active={active} />
    </form>
  );
}

function FormInput({ inputRef, setActive }) {
  const handleChange = (e) => {
    setActive(e.target.value.trim() !== "");
  };

  return (
    <input
      type="text"
      onChange={handleChange}
      ref={inputRef}
      placeholder="Send a message..."
      className="new-message__input"
      aria-label="type a message"
    />
  );
}

function SubmitButton({ active }) {
  return (
    <button
      type="submit"
      className={`new-message__button new-message__button--${
        active ? "active" : "inactive"
      }`}
      aria-label="send message"
    >
      <FontAwesomeIcon icon={faPaperPlane} />
    </button>
  );
}

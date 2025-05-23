import { useEffect, useRef, useState } from "react";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import { useChatContext } from "../../context/ChatContext";
import "./settings-button.scss";

export default function SettingsButton({ chat }) {
  const { deleteChat } = useChatContext();
  const { theme } = useThemeContext();

  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSettingsClick = (e) => {
    e.stopPropagation();
    setShowSettings(!showSettings);
  };

  const handlePin = (e) => {
    e.stopPropagation();

    console.log("pin");
  };

  const handleBlock = (e) => {
    e.stopPropagation();

    console.log("block");
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this chat?")) {
      await deleteChat(chat.chatId);
    }
  };

  return (
    <div ref={settingsRef} className={`settings settings--${theme}`}>
      <FontAwesomeIcon
        icon={faEllipsis}
        onClick={handleSettingsClick}
        className="settings__button"
      />

      <div className="settings__dropdown" aria-expanded={showSettings}>
        <Button label="Pin" onClick={handlePin} />
        <Button label="Block" onClick={handleBlock} />
        <Button label="Delete" onClick={handleDelete} />
      </div>
    </div>
  );
}

function Button({ label, onClick }) {
  return (
    <button type="button" onClick={onClick} className="settings__item">
      {label}
    </button>
  );
}

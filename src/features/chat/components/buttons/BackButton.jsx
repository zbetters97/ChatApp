import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChatContext } from "src/features/chat/context/ChatContext";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import "./back-button.scss";

export default function BackButton() {
  const { setIsCollapsed, setActiveChatId } = useChatContext();
  const { theme } = useThemeContext();

  const handleCollapse = () => {
    setActiveChatId(-1);
    setIsCollapsed(false);
  };

  return (
    <button
      type="button"
      onClick={handleCollapse}
      className={`back-button back-button--${theme}`}
      aria-label="Back to chats"
    >
      <FontAwesomeIcon icon={faAngleLeft} className="chats__back-arrow" />
    </button>
  );
}

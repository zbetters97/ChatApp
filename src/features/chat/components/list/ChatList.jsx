import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MOBILE_WIDTH } from "src/data/const";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChatContext } from "../../context/ChatContext";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import ThemeToggle from "src/features/theme/components/buttons/ThemeToggle";
import {
  faArrowRightFromBracket,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import ChatCard from "../cards/ChatCard";
import "./chat-list.scss";

export default function ChatList({ handleOpenChat }) {
  const { isCollapsed } = useChatContext();
  const { theme } = useThemeContext();

  useEffect(() => {
    if (isCollapsed) return;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isCollapsed]);

  return (
    <section
      className={`chatlist chatlist--${theme}`}
      aria-expanded={!isCollapsed}
    >
      <Header />
      <Chats handleOpenChat={handleOpenChat} />
      <Footer />
    </section>
  );
}

function Header() {
  const { theme } = useThemeContext();

  return (
    <div className={`chatlist__header chatlist__header--${theme}`}>
      <ThemeToggle />
      <h2 className="chatlist__title">All chats</h2>
      <Compose />
    </div>
  );
}

function Compose() {
  const { globalUser } = useAuthContext();
  const { setIsCollapsed, setActiveChatId, activeChatUser, setActiveChatUser } =
    useChatContext();
  const { theme } = useThemeContext();

  async function handleNewChat() {
    if (!activeChatUser || !globalUser) return;

    setActiveChatId(-1);
    setActiveChatUser({});

    if (window.innerWidth <= MOBILE_WIDTH) {
      setIsCollapsed(true);
    }
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

function Footer() {
  const { globalUser, logout } = useAuthContext();
  const { theme } = useThemeContext();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <div className={`chatlist__footer chatlist__footer--${theme}`}>
      <p className={`chatlist__current-user chatlist__current-user--${theme}`}>
        {globalUser.fullname}
      </p>
      <button
        type="button"
        onClick={handleLogout}
        className={`chatlist__logout chatlist__logout--${theme}`}
      >
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
      </button>
    </div>
  );
}

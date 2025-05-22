import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { db } from "src/config/firebase";
import { MOBILE_WIDTH } from "src/data/const";
import { formatDateDMD } from "src/utils/date";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import NewMessage from "../inputs/NewMessage";
import ChatSearch from "../inputs/ChatSearch";
import MessageCard from "../cards/MessageCard";
import BackButton from "../buttons/BackButton";
import { useChatContext } from "../../context/ChatContext";
import "./chat-window.scss";

export default function ChatWindow() {
  const { globalUser } = useAuthContext();
  const { isCollapsed, activeChatId, activeChatUser, readMessage } =
    useChatContext();
  const { theme } = useThemeContext();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (activeChatId === -1) return;

    const unsubscribe = onSnapshot(
      doc(db, "chats", activeChatId),
      async (doc) => {
        const messages = doc
          .data()
          .messages.sort((a, b) => a.createdAt - b.createdAt);

        if (messages.length === 0) return;

        const messageData = await processMessages(messages);
        setMessages(messageData);

        markAsRead();
      },
      (error) => {
        console.log(error);
      }
    );

    return () => unsubscribe();
  }, [activeChatId, activeChatUser]);

  const processMessages = async (messages) => {
    const messageData = await Promise.all(
      messages.map(async (message) => {
        if (!message || !globalUser) return null;

        // Check if message sender is current user
        const user =
          message.senderId === globalUser.uid ? globalUser : activeChatUser;

        return {
          chatId: activeChatId,
          ...message,
          firstname: user.firstname,
        };
      })
    );

    return messageData;
  };

  const markAsRead = async () => {
    // Delay read message to allow navbar to sync unread count
    setTimeout(async () => {
      await readMessage(activeChatId, globalUser.uid);
    }, 1500);
  };

  if (activeChatId === -1) {
    return (
      <section className={`chats chats--${theme}`} aria-expanded={isCollapsed}>
        <div className="chats__search">
          <BackButton />
          <ChatSearch />
        </div>
      </section>
    );
  }

  return (
    <section className={`chats chats--${theme}`} aria-expanded={isCollapsed}>
      <Messages messages={messages} />
    </section>
  );
}

function Messages({ messages }) {
  const { isCollapsed } = useChatContext();

  const chatRef = useRef(null);
  const prevMessagLength = useRef(messages.length);

  useLayoutEffect(() => {
    // Don't scroll to bottom if low message count
    if (messages.length < 3) return;

    // Scroll to bottom if new message comes in
    if (prevMessagLength.current.length >= messages.length) return;

    // Scroll to bottom for mobile and desktop
    if (window.innerWidth <= MOBILE_WIDTH) {
      window.scrollTo({
        top: document.body.scrollHeight,
      });
    } else {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }

    prevMessagLength.current = messages.length;
  }, [messages]);

  return (
    <div
      ref={chatRef}
      className="chats__messages--wrapper"
      aria-expanded={!isCollapsed}
    >
      <Header />

      <div className="chats__messages">
        {messages &&
          messages.map((message, index) => {
            return (
              <div key={message.id} className="chats__message">
                <MessageDate
                  message={message}
                  index={index}
                  messages={messages}
                />
                <MessageCard message={message} />
              </div>
            );
          })}
      </div>

      <NewMessage />
    </div>
  );
}

function Header() {
  const { activeChatUser } = useChatContext();
  const { theme } = useThemeContext();

  return (
    <div className={`chats__header chats__header--${theme}`}>
      <BackButton />

      <h2 className="chats__name">
        {activeChatUser.fullname || "Display Name"}
      </h2>
    </div>
  );
}

function MessageDate({ message, index, messages }) {
  const date = message.createdAt.toDate();

  const isDifferentDate =
    index === 0
      ? date !== new Date()
      : date.getDate() !== messages[index - 1].createdAt.toDate().getDate();

  if (!isDifferentDate) {
    return;
  }

  return <p className="chats__date">{formatDateDMD(date)}</p>;
}

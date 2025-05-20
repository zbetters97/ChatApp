import { useRef, useState } from "react";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import "./chat-search.scss";

export default function ChatSearch() {
  const [users, setUsers] = useState([]);
  const inputRef = useRef(null);

  return (
    <div className="chat-search">
      <SearchInput inputRef={inputRef} setUsers={setUsers} />
      <SearchResults users={users} setUsers={setUsers} inputRef={inputRef} />
    </div>
  );
}

function SearchInput({ inputRef, setUsers }) {
  const { globalUser, searchByName } = useAuthContext();

  const handleSearch = async (e) => {
    if (e.target.value.trim() === "") {
      setUsers([]);
      return;
    }

    const fetchedUsers = await searchByName(e.target.value, globalUser.uid);

    setUsers(fetchedUsers);
  };

  return (
    <input
      type="text"
      ref={inputRef}
      onChange={handleSearch}
      placeholder="Search for a user..."
      className="chat-search__input"
      aria-label="search for a user"
    />
  );
}

function SearchResults({ users, setUsers, inputRef }) {
  const { globalUser, getUserById } = useAuthContext();
  const { chats, addChat, setActiveChatId, setActiveChatUser } =
    useChatContext();

  const handleAddUser = async (friendId) => {
    inputRef.current.value = "";
    setUsers([]);

    const foundChat = chats.find((chat) => chat.recipientId === friendId);

    if (foundChat) {
      setActiveChatId(foundChat.chatId);
      setActiveChatUser(foundChat);
    } else {
      const chatId = await addChat(globalUser.uid, friendId);
      const recipient = await getUserById(friendId);
      setActiveChatId(chatId);
      setActiveChatUser(recipient);
    }
  };

  return (
    <div className="chat-search__users" aria-expanded={users.length > 0}>
      {users.map((user) => (
        <button
          key={user.uid}
          onClick={() => handleAddUser(user.uid)}
          className="chat-search__user"
          aria-label="add user to chat"
        >
          <p className="chat-search__name">{user.fullname}</p>
        </button>
      ))}
    </div>
  );
}

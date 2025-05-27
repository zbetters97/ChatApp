import { useEffect, useState } from "react";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import { useChatContext } from "../../context/ChatContext";
import "./chat-search.scss";

export default function ChatSearch() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  return (
    <div className="chat-search">
      <SearchInput search={search} setSearch={setSearch} setUsers={setUsers} />
      <SearchResults users={users} setUsers={setUsers} setSearch={setSearch} />
    </div>
  );
}

function SearchInput({ search, setSearch, setUsers }) {
  const { globalUser, searchByName } = useAuthContext();
  const { theme } = useThemeContext();

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (isSearching) return;

      setIsSearching(true);

      try {
        if (search === "") {
          setUsers([]);
          return;
        }

        const fetchedUsers = await searchByName(search, globalUser.uid);
        setUsers(fetchedUsers);
      } finally {
        setIsSearching(false);
      }
    };

    handleSearch();
  }, [search, isSearching]);

  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value.trim())}
      placeholder="Search for a user..."
      className={`chat-search__input chat-search__input--${theme}`}
      aria-label="search for a user"
    />
  );
}

function SearchResults({ users, setUsers, setSearch }) {
  const { globalUser, getUserById } = useAuthContext();
  const { chats, addChat, setActiveChatId, setActiveChatUser } =
    useChatContext();

  const handleAddUser = async (friendId) => {
    setSearch("");
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
          <p className="chat-search__name">{user.displayname}</p>
        </button>
      ))}
    </div>
  );
}

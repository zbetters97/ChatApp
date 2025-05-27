import { db } from "src/config/firebase";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export function useChat() {
  async function getChatById(chatId) {
    try {
      const chatRef = doc(db, "chats", chatId);
      const chatRefSnap = await getDoc(chatRef);

      if (!chatRefSnap.exists()) return null;

      return chatRefSnap.data();
    } catch (error) {
      console.log(error);
    }
  }

  async function getChatsByUserId(userId) {
    try {
      const userChatsRef = doc(db, "userchats", userId);
      const userChatsDocSnap = await getDoc(userChatsRef);

      if (!userChatsDocSnap.exists()) return null;

      return userChatsDocSnap.data().chats;
    } catch (error) {
      console.log(error);
    }
  }

  async function addChat(senderId, recipientId) {
    try {
      const chatRef = collection(db, "chats");

      const newchatRef = doc(chatRef);

      await setDoc(newchatRef, {
        messages: [],
        createdAt: new Date(),
      });

      await addUserChat(senderId, recipientId, newchatRef.id);
      await addUserChat(recipientId, senderId, newchatRef.id);

      return newchatRef.id;
    } catch (error) {
      console.log(error);
    }
  }

  async function addUserChat(senderId, recipientId, chatId) {
    try {
      const userChatRef = doc(db, "userchats", senderId);
      const userchatRef = await getDoc(userChatRef);

      if (!userchatRef.exists()) {
        await setDoc(userChatRef, {
          chats: [
            {
              chatId,
              lastMessage: "",
              recipientId,
              unread: 0,
              pinned: false,
              updatedAt: new Date(),
            },
          ],
        });
      } else {
        await updateDoc(doc(db, "userchats", senderId), {
          chats: arrayUnion({
            chatId,
            lastMessage: "",
            recipientId,
            unread: 0,
            pinned: false,
            updatedAt: new Date(),
          }),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function pinChat(chatId, recipientId) {
    try {
      const userChatsRef = collection(db, "userchats");
      if (!userChatsRef) return;

      // Query all userchats
      const q = query(userChatsRef);
      const snapshot = await getDocs(q);

      // Filter the query by the chats array where...
      // the map's chatId and recipientId match
      const filteredData = snapshot.docs.filter((doc) => {
        const chats = doc.data().chats;
        return chats.some(
          (chat) => chat.chatId === chatId && chat.recipientId === recipientId
        );
      });

      // If no matches, return
      if (filteredData.length === 0) return;

      // Iterate through matches
      filteredData.forEach((doc) => {
        const chats = doc.data().chats;

        // Create new array with updated pinned value
        const updatedChats = chats.map((chat) => {
          if (chat.chatId === chatId && chat.recipientId === recipientId) {
            return {
              ...chat,
              pinned: !chat.pinned,
            };
          }

          return chat;
        });

        // Update userchats with new array
        updateDoc(doc.ref, {
          chats: updatedChats,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function reorderChats(userChatId, newOrder) {
    try {
      await updateDoc(doc(db, "userchats", userChatId), { chats: newOrder });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteChat(chatId) {
    try {
      const chatRef = doc(db, "chats", chatId);
      if (!chatRef) return;

      // Delete chat from chats collection
      await deleteDoc(chatRef);

      const userChatsRef = collection(db, "userchats");
      if (!userChatsRef) return;

      // Query all userchats
      const q = query(userChatsRef);
      const snapshot = await getDocs(q);

      // Filter the query by the chats array where...
      // the map's chatId matches
      const filteredData = snapshot.docs.filter((doc) => {
        const chats = doc.data().chats;
        return chats.some((chat) => chat.chatId === chatId);
      });

      // If no matches, return
      if (filteredData.length === 0) return;

      // Iterate through matches
      filteredData.forEach((doc) => {
        const chats = doc.data().chats;

        // Create new array without deleted chat map
        const updatedChats = chats.filter((chat) => chat.chatId !== chatId);

        // Replace userchats array with new array
        updateDoc(doc.ref, { chats: updatedChats });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getUnreadChatsByUserId(userId) {
    try {
      const userChatsRef = doc(db, "userchats", userId);
      const userChatsDoc = await getDoc(userChatsRef);

      if (!userChatsDoc.exists()) return null;

      const userChatsData = userChatsDoc.data();
      const totalCount = userChatsData.chats.reduce((acc, chat) => {
        return acc + chat.unread;
      }, 0);

      return totalCount;
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage(
    chatId,
    senderId,
    recipientId,
    text,
    category = ""
  ) {
    try {
      const id = Date.now().toString();

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          id,
          senderId: senderId,
          text,
          category,
          isLiked: false,
          isDeleted: false,
          createdAt: new Date(),
        }),
      });

      text = category
        ? `Message contains ${
            category === "track" || category === "review" ? "a" : "an"
          } ${category}`
        : text;

      await Promise.all(
        [senderId, recipientId].map(async (userId) => {
          const userChatRef = doc(db, "userchats", userId);
          const userchatRef = await getDoc(userChatRef);

          if (!userchatRef.exists()) return;

          const userChatsData = userchatRef.data();
          const chatIndex = userChatsData.chats.findIndex(
            (chat) => chat.chatId === chatId
          );

          if (chatIndex === -1) return;

          userChatsData.chats[chatIndex].lastMessage = text;

          const unreadCount = userChatsData.chats[chatIndex].unread || 0;

          userChatsData.chats[chatIndex].unread =
            userId === senderId ? unreadCount : unreadCount + 1;

          userChatsData.chats[chatIndex].updatedAt = new Date();

          await updateDoc(userChatRef, { chats: userChatsData.chats });
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function likeMessage(messageId, chatId, isLiked) {
    try {
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
      const messages = chatDoc.data().messages;

      const existingMessage = messages.find(
        (message) => message.id === messageId
      );

      if (existingMessage) {
        await updateDoc(chatRef, {
          messages: messages.map((message) =>
            message.id === messageId ? { ...message, isLiked } : message
          ),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function readMessage(chatId, recipientId) {
    try {
      const userChatsDoc = doc(db, "userchats", recipientId);
      const userChatsDocSnap = await getDoc(userChatsDoc);

      if (userChatsDocSnap.empty) return;

      const userChatsData = userChatsDocSnap.data();
      const chatIndex = userChatsData.chats.findIndex(
        (chat) => chat.chatId === chatId
      );

      if (chatIndex === -1) return;

      userChatsData.chats[chatIndex].unread = 0;

      await updateDoc(userChatsDoc, { chats: userChatsData.chats });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteMessage(messageId, chatId, senderId, recipientId) {
    try {
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
      const messages = chatDoc.data().messages;

      const index = messages.findIndex((message) => message.id === messageId);
      if (index === -1) return;

      await updateDoc(chatRef, {
        messages: messages.map((message, i) =>
          i === index
            ? {
                ...message,
                text: "This message was deleted",
                isDeleted: true,
              }
            : message
        ),
      });

      // Stop if deleted message was not last message sent
      if (index !== messages.length - 1) return;

      await Promise.all(
        [senderId, recipientId].map(async (userId) => {
          const userChatsRef = doc(db, "userchats", userId);
          const userChatsDoc = await getDoc(userChatsRef);

          if (userChatsDoc.empty) return;

          const userChatsData = userChatsDoc.data();
          const chatIndex = userChatsData.chats.findIndex(
            (chat) => chat.chatId === chatId
          );

          if (chatIndex === -1) return;

          userChatsData.chats[chatIndex].lastMessage =
            "This message was deleted";

          if (userChatsData.chats[chatIndex].unread !== 0) {
            userChatsData.chats[chatIndex].unread--;
          }

          await updateDoc(userChatsRef, { chats: userChatsData.chats });
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getChatById,
    getChatsByUserId,
    getUnreadChatsByUserId,

    addChat,
    pinChat,
    reorderChats,
    deleteChat,

    sendMessage,
    readMessage,
    likeMessage,
    deleteMessage,
  };
}

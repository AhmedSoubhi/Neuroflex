import { doc, onSnapshot, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { db } from "../Firebase";

const normalizeChatData = (data) => {
  const chatEntries = {};

  Object.entries(data).forEach(([key, value]) => {
    const parts = key.replace('chats.', '').split('.');
    const chatId = parts[0];
    if (parts.length > 1) {
      const property = parts[1];

      if (!chatEntries[chatId]) {
        chatEntries[chatId] = { chatId, userInfo: null, date: null };
      }

      if (property.includes("userInfo")) {
        chatEntries[chatId].userInfo = { ...value, uid: chatId };
      } else if (property === "date" && value) {
        chatEntries[chatId].date = new Date(value.seconds * 1000);
      }
    }
  });

  return Object.values(chatEntries);
};

const ensureChatDocumentExists = async (chatId) => {
  const chatDocRef = doc(db, "chats", chatId);
  const docSnap = await getDoc(chatDocRef);
  if (!docSnap.exists()) {
    console.log("Creating new chat document for ID:", chatId);
    await setDoc(chatDocRef, { messages: [] });
  }
};

const ensureUserChatDocumentExists = async (userId, chatId) => {
  const userChatDocRef = doc(db, "userChats", userId, "chats", chatId);
  const docSnap = await getDoc(userChatDocRef);
  if (!docSnap.exists()) {
    console.log("Creating new user chat document for ID:", chatId);
    await setDoc(userChatDocRef, { lastMessage: "", date: serverTimestamp() });
  }
};

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      if (currentUser?.uid) {
        const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (docSnapshot) => {
          if (docSnapshot.exists()) {
            const normalizedData = normalizeChatData(docSnapshot.data() || {});
            setChats(normalizedData);
          } else {
            console.log("No chats data available.");
            setChats([]);
          }
        });
        return () => unsub();
      }
    };
    getChats();
  }, [currentUser?.uid]);

  const handleSelect = async (userInfo) => {
    if (!userInfo || !currentUser || !currentUser.uid || !userInfo.uid) {
      console.error("Missing user information for chat.");
      return;
    }

    const ids = [currentUser.uid, userInfo.uid].sort();
    const newChatId = ids.join('');

    await ensureChatDocumentExists(newChatId);
    await ensureUserChatDocumentExists(currentUser.uid, newChatId);
    await ensureUserChatDocumentExists(userInfo.uid, newChatId);

    dispatch({ type: "CHANGE_USER", payload: { ...userInfo, chatId: newChatId } });
  };

  return (
    <div className="chats">
      {chats.sort((a, b) => {
        const dateA = a.date || new Date(0);
        const dateB = b.date || new Date(0);
        return dateB.getTime() - dateA.getTime();
      }).map((chat) => {
        const { userInfo } = chat;
        if (!userInfo) {
          console.warn("UserInfo missing in chat entry:", chat);
          return null;
        }
        return (
          <div className="userChat" key={userInfo.uid} onClick={() => handleSelect(userInfo)}>
            <img src={userInfo.photoURL || 'default-avatar.png'} alt={userInfo.displayName || 'User'} />
            <div className="userChatInfo">
              <span>{userInfo.displayName || 'Unknown User'}</span>
              <p>{chat.lastMessage?.text || 'No messages yet'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chats;

import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../Firebase";
import { AuthContext } from "../Context/AuthContext";
const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
  
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
        setErr(false); // Reset error on successful operation
      } else {
        setErr("User not found!"); // More descriptive error
      }
    } catch (error) {
      console.error("Search error:", error);
      setErr("Failed to search due to an error."); // Descriptive error message
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    const combinedId =
        currentUser.uid > user.uid
            ? currentUser.uid + user.uid
            : user.uid + currentUser.uid;

    try {
        // Create or update the chat document with an empty messages array if it doesn't exist
        await setDoc(doc(db, "chats", combinedId), { messages: [] }, { merge: true });

        // Ensure the 'userChats' document for both users exist before updating
        const userChatsRef = doc(db, "userChats", currentUser.uid);
        const otherUserChatsRef = doc(db, "userChats", user.uid);

        // Set or update user chats document for current user
        await setDoc(userChatsRef, {
            [`chats.${combinedId}.userInfo`]: {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
            },
            [`chats.${combinedId}.date`]: serverTimestamp(),
        }, { merge: true });

        // Set or update user chats document for the other user
        await setDoc(otherUserChatsRef, {
            [`chats.${combinedId}.userInfo`]: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
            },
            [`chats.${combinedId}.date`]: serverTimestamp(),
        }, { merge: true });
    } catch (err) {
        console.error("Failed to create or update chat:", err);
    }

    setUser(null);
    setUsername("");
};
return (
  <div className="search">
    <div className="searchForm">
      <input
        type="text"
        placeholder="Find a user"
        onKeyDown={handleKey}
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
    </div>
    {err && <span>{err}</span>} 
    {user && (
      <div className="userChat" onClick={handleSelect}>
        <img src={user.photoURL} alt={user.displayName || "User"} />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>
    )}
  </div>
);
};

export default Search;
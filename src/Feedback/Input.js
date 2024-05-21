import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../Firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const ensureDocumentExists = async (path) => {
  const docRef = doc(db, ...path);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.log(`No document found at path: ${docRef.path}, creating one...`);
    await setDoc(docRef, { messages: [] }, { merge: true });
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

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (!data.chatId || data.chatId === "null") {
      console.error("Chat ID is null. Select a user to chat with first.");
      return;
    }

    const messageId = uuid();
    const messagePayload = {
      id: messageId,
      text: text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
      img: null,  // Default to null unless an image is uploaded
    };

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on('state_changed', null, error => {
        console.error("Upload failed:", error);
      }, async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        messagePayload.img = downloadURL;
        await sendMessage(messagePayload);
      });
    } else {
      await sendMessage(messagePayload);
    }

    // Clear the input fields
    setText("");
    setImg(null);
  };

  const sendMessage = async (messagePayload) => {
    const chatDocRef = ["chats", data.chatId];
    await ensureDocumentExists(chatDocRef);

    await updateDoc(doc(db, ...chatDocRef), {
      messages: arrayUnion(messagePayload),
    });

    // Ensure user chat documents exist
    await ensureUserChatDocumentExists(currentUser.uid, data.chatId);
    await ensureUserChatDocumentExists(data.user.uid, data.chatId);

    // Update userChats to show the last message for both users
    await updateDoc(doc(db, "userChats", currentUser.uid, "chats", data.chatId), {
      lastMessage: { text: messagePayload.text },
      date: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid, "chats", data.chatId), {
      lastMessage: { text: messagePayload.text },
      date: serverTimestamp(),
    });
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;

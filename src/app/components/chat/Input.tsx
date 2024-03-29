import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import db, { storage } from "@/firebase";
import { v4 as uuidv4 } from "uuid";
import { ChatSharp } from "@mui/icons-material";
// import { channelChatroom } from "../../../../pusher";

const Input = () => {
  const [text, setText] = useState<string>("");
  const [imageFile, setImg] = useState<File | null>(null);

  const data = useSelector((state: RootState) => state.chat);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentUser?.uid && data?.chatId && text) {
      try {
        if (imageFile) {
          const storageRef = ref(storage, uuidv4());
          const uploadTask = uploadBytesResumable(storageRef, imageFile);

          const snapshot = await uploadTask;
          const downloadURL = await getDownloadURL(snapshot.ref);

          await updateDoc(doc(db, "messages", data.chatId), {
            messages: arrayUnion({
              id: uuidv4(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
        } else {
          await updateDoc(doc(db, "messages", data.chatId), {
            messages: arrayUnion({
              id: uuidv4(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
            }),
          });
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });

        // pusher.trigger("my-channel", "my-event", {
        //   message: arrayUnion({
        //     id: uuidv4(),
        //     text,
        //     senderId: currentUser.uid,
        //     date: Timestamp.now(),
        //   }),
        // });

        // channelChatroom.trigger("client-message", {
        //   id: uuidv4(),
        //   text,
        //   senderId: currentUser.uid,
        //   date: Timestamp.now(),
        // });

        setText("");
        setImg(null);
      } catch (error) {
        console.error("Error in handleSend:", error);
      }
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImg(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSend} className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={handleTextChange}
        value={text}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={handleImageChange}
        />
        <label htmlFor="file">
          <ChatSharp />
        </label>
        <button type="button">Send</button>
      </div>
    </form>
  );
};

export default Input;

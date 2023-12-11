import React, { useState, ChangeEvent, KeyboardEvent } from "react";
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
  DocumentSnapshot,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux"; // Replace with your actual paths
import { RootState } from "@/redux/store";
import db from "@/firebase";
import { changeUser } from "@/redux/features/chatSlice";
import Image from "../Image";
import { Box } from "@mui/material";

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
}

const Search: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [err, setErr] = useState<boolean>(false);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username),
      where("isVendor", "==", true)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data() as User);
      });
      setErr(false);
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      if (!username) {
        setUser(null);
        setErr(true);
        return;
      }
      handleSearch();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setErr(false);
  };

  const handleSelect = async () => {
    if (!user) return;

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res: DocumentSnapshot = await getDoc(
        doc(db, "messages", combinedId)
      );

      if (!res.exists()) {
        await setDoc(doc(db, "messages", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }

      dispatch(
        changeUser({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          currentUserId: currentUser.uid,
        })
      );
      setUser(null);
      setUsername("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a shop to chat"
          onKeyDown={handleKey}
          onChange={handleChange}
          value={username}
        />
      </div>
      {err && (
        <Box color="red" px={2}>
          User not found!
        </Box>
      )}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <Image
            src={user.photoURL || "/assets/images/avatars/001-man.svg"}
            alt="user"
          />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

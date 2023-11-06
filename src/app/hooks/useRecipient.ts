// useRecipient hook without react-firebase-hooks
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getRecipientEmail } from "@/utils/lib";
import { AppUser, Conversation } from "@/models/Chats";
import db, { auth } from "@/firebase";

const useRecipient = (conversationUsers: Conversation["users"]) => {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [recipient, setRecipient] = useState<AppUser | undefined>(undefined);
  const [recipientEmail, setRecipientEmail] = useState<string>("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoggedInUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser);

    if (recipientEmail) {
      setRecipientEmail(recipientEmail);
      const q = query(
        collection(db, "users"),
        where("email", "==", recipientEmail)
      );

      getDocs(q)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            setRecipient(querySnapshot.docs[0].data() as AppUser);
          }
        })
        .catch((error) => {
          console.error("Error getting recipient:", error);
        });
    }
  }, [conversationUsers, loggedInUser]);

  return {
    recipient,
    recipientEmail,
  };
};

export default useRecipient;

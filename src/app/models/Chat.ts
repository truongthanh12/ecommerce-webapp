import { Timestamp } from "firebase/firestore";

export interface IChat {
  date: Timestamp;
  id: string;
  senderId: string;
  text: string;
  img: string;
}

export interface MessageType {
  img: string;
  senderId: string;
}

export interface ChatType {
  date: number;
  userInfo: UserInfoType;
  lastMessage: MessageType;
}

export interface UserInfoType {
  email: string;
  displayName: string;
  photoURL: string | undefined;
}

export interface MessageType {
  text: string;
}

import Pusher from "pusher-js";

export const pusher = new Pusher(
  process.env.NEXT_PUBLIC_PUSHSER_APP_KEY || "",
  {
    cluster: process.env.NEXT_PUBLIC_PUSHSER_CLUSTER || "",
    authEndpoint: "http://localhost:3080/pusher/auth",
  }
);

export const channelChatroom = pusher.subscribe("private-chatroom");

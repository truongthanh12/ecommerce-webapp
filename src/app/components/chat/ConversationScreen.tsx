import IconButton from '@mui/material/IconButton'
// import { useRecipient } from '../hooks/useRecipient'
import {
	convertFirestoreTimestampToString,
	generateQueryGetMessages,
	transformMessage
} from '@/utils/lib'
import RecipientAvatar from './RecipientAvatar'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useRouter } from 'next/router'
import db from "@/firebase";
import { auth } from '@/firebase'
import Message from './Message'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import SendIcon from '@mui/icons-material/Send'
import MicIcon from '@mui/icons-material/Mic'
import {
	KeyboardEventHandler,
	MouseEventHandler,
	useEffect,
	useRef,
	useState
} from 'react'
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	setDoc
} from 'firebase/firestore'
import { styled } from '@mui/material'
import { Conversation, IMessage } from '@/app/models/Chats'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

const StyledRecipientHeader = styled("div")(() => ({
  position: "sticky",
  backgroundColor: "white",
  zIndex: 100,
  top: 0,
  display: "flex",
  alignItems: "center", // Fixed a typo here
  padding: "11px",
  height: "80px",
  borderBottom: "1px solid whitesmoke",
}));

const StyledHeaderInfo = styled("div")(() => ({
  flexGrow: 1,

	"&>h3" :{
		marginTop: 0,
		marginBottom: "3px",
	},

	"&>span" :{
		fontSize: "14px",
		color: "gray",
	}
}));
const StyledH3 = styled("h3")(() => ({
	wordBreak: "break-all"
}));

const StyledHeaderIcons = styled("div")(() => ({
	display: "flex"
}));

const StyledMessageContainer = styled("div")(() => ({
	padding: "30px",
	backgroundColor: "#e5ded8",
	minHeight: "90vh",
}));

const StyledInputContainer = styled("form")(() => ({
	display: "flex",
	alignItems: "center",
	padding: "10px",
	position: "sticky",
	bottom: 0,
	backgroundColor: "white",
	zIndex: 100,
}))

const StyledInput = styled("input")(() => ({
	flexGrow: 1,
	outline: "none",
	border: "none",
	borderRadius: "10px",
	backgroundColor: "whitesmoke",
	padding: "15px",
	marginLeft: "15px",
	marginRight: "15px",
}))

const EndOfMessagesForAutoScroll = styled("div")(() => ({
	marginBottom: "30px"
}));
const ConversationScreen = ({
  conversation,
  messages,
}: {
  conversation: Conversation;
  messages: IMessage[];
}) => {
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();
  const conversationId = router.query.id as string; // localhost:3000/conversations/:id
  const { user } = useSelector((state: RootState) => state.auth);

  const queryGetMessages: any = generateQueryGetMessages(conversationId);

  const [messagesSnapshot, setMessagesSnapshot] = useState<any>(null);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);

  const showMessages = () => {
    // If front-end is loading messages behind the scenes, display messages retrieved from Next SSR (passed down from [id].tsx)
    if (messagesLoading) {
      return messages.map((message) => <Message key={message.id} message={message} />);
    }

    // If front-end has finished loading messages, so now we have messagesSnapshot
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message: any) => <Message key={message.id} message={transformMessage(message)} />);
    }

    return null;
  };

  const addMessageToDbAndUpdateLastSeen = async () => {
    const user = auth.currentUser;
    if (!user) {
      // Handle the case where the user is not authenticated
      return;
    }

    // update last seen in 'users' collection
    await setDoc(
      doc(db, 'users', user.email as string),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    ); // just update what is changed

    // add new message to 'messages' collection
    await addDoc(collection(db, 'messages'), {
      conversation_id: conversationId,
      sent_at: serverTimestamp(),
      text: newMessage,
      user: user.email,
    });

    // reset input field
    setNewMessage('');

    // scroll to bottom
    scrollToBottom();
  };

  const sendMessageOnEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!newMessage) return;
      addMessageToDbAndUpdateLastSeen();
    }
  };

  const sendMessageOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    if (!newMessage) return;
    addMessageToDbAndUpdateLastSeen();
  };

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const unsubscribe = queryGetMessages.onSnapshot(
      (snapshot: any) => {
        setMessagesSnapshot(snapshot);
        setMessagesLoading(false);
      },
      (error: any) => {
        console.error('Error getting messages:', error);
        setMessagesLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [queryGetMessages]);

  return (
    <>
      <StyledRecipientHeader>
        <RecipientAvatar recipient={user} recipientEmail={conversation.users[0]} />

        <StyledHeaderInfo>
          <StyledH3>{conversation.users[0]}</StyledH3>
          <span>Last active: {new Date().toLocaleTimeString()}</span>
        </StyledHeaderInfo>

        <StyledHeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </StyledHeaderIcons>
      </StyledRecipientHeader>

      <StyledMessageContainer>
        {showMessages()}
        {/* for auto-scroll to the end when a new message is sent */}
        <EndOfMessagesForAutoScroll ref={endOfMessagesRef} />
      </StyledMessageContainer>

      {/* Enter a new message */}
      <StyledInputContainer>
        <InsertEmoticonIcon />
        <StyledInput
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          onKeyDown={sendMessageOnEnter}
        />
        <IconButton onClick={sendMessageOnClick} disabled={!newMessage}>
          <SendIcon />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </StyledInputContainer>
    </>
  );
};

export default ConversationScreen;

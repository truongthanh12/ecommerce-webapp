import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVerticalIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { TextField, DialogActions, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { addDoc, collection, query, where } from "firebase/firestore";
import db, { auth } from "@/firebase";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const StyledContainer = styled("div")({
  height: "100vh",
  minWidth: "300px",
  maxWidth: "350px",
  overflowY: "scroll",
  borderRight: "1px solid whitesmoke",

  /* Hide scrollbar for Chrome, Safari, and Opera */
  "&::-webkit-scrollbar": {
    display: "none",
  },

  /* Hide scrollbar for IE, Edge, and Firefox */
  msOverflowStyle: "none" /* IE and Edge */,
  scrollbarWidth: "none" /* Firefox */,
});

const StyledHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  height: "80px",
  borderBottom: "1px solid whitesmoke",
  position: "sticky",
  top: 0,
  backgroundColor: "white",
  zIndex: 1,
});

const StyledSearch = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: "15px",
  borderRadius: "2px",
});

const StyledUserAvatar = styled(Avatar)({
  cursor: "pointer",
  "&:hover": {
    opacity: 0.8,
  },
});

const StyledSearchInput = styled("input")({
  outline: "none",
  border: "none",
  flex: 1,
});

const StyledSidebarButton = styled(Button)({
  width: "100%",
  borderTop: "1px solid whitesmoke",
  borderBottom: "1px solid whitesmoke",
});

const Sidebar = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] =
    useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [conversationsSnapshot, setConversationsSnapshot] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Fetch conversations for the current user when user changes
      if (user) {
        const q = query(
          collection(db, "conversations"),
          where("users", "array-contains", user.email)
        );
        setConversationsSnapshot(q);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleNewConversationDialog = (isOpen: boolean) => {
    setIsOpenNewConversationDialog(isOpen);
    if (!isOpen) setRecipientEmail("");
  };

  const closeNewConversationDialog = () => {
    toggleNewConversationDialog(false);
  };

  const isConversationAlreadyExists = (recipientEmail: string) => {
    if (!conversationsSnapshot || conversationsSnapshot.docs.length === 0)
      return false;

    return conversationsSnapshot.docs.some((conversation: any) =>
      conversation.data().users.includes(recipientEmail)
    );
  };

  const isInvitingSelf = recipientEmail === user.email;

  const createConversation = async () => {
    if (!recipientEmail) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(recipientEmail);

    if (
      isValidEmail &&
      !isInvitingSelf &&
      !isConversationAlreadyExists(recipientEmail)
    ) {
      // Add conversation user to db "conversations" collection
      // A conversation is between the currently logged in user and the user invited.
      await addDoc(collection(db, "conversations"), {
        users: [user.email, recipientEmail],
      });
    }

    closeNewConversationDialog();
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <Tooltip title={user.email as string} placement="right">
          <StyledUserAvatar src={user.photoURL || ""} />
        </Tooltip>

        <div>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVerticalIcon />
          </IconButton>
          <IconButton>
            <LogoutIcon />
          </IconButton>
        </div>
      </StyledHeader>

      <StyledSearch>
        <SearchIcon />
        <StyledSearchInput placeholder="Search in conversations" />
      </StyledSearch>

      <StyledSidebarButton onClick={() => toggleNewConversationDialog(true)}>
        Start a new conversation
      </StyledSidebarButton>

      {/* List of conversations */}
      {conversationsSnapshot?.docs.map((conversation: any) => (
        <div key={conversation.id}>
          {/* Render your ConversationSelect component here */}
        </div>
      ))}

      <Dialog
        open={isOpenNewConversationDialog}
        onClose={closeNewConversationDialog}
      >
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a valid email address for the user you wish to chat
            with
          </DialogContentText>
          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={recipientEmail}
            onChange={(event) => {
              setRecipientEmail(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewConversationDialog}>Cancel</Button>
          <Button disabled={!recipientEmail} onClick={createConversation}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default Sidebar;

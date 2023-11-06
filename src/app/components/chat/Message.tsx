import { IMessage } from "@/app/models/Chats"
import { RootState } from "@/redux/store";
import { styled } from "@mui/material";
import { useSelector } from "react-redux";
const StyledMessage = styled("div")(() => ({
	width: "fit-content",
	wordBreak: "break-all",
	maxWidth: "90%",
	minWidth: "30%",
	padding: "15px 15px 30px",
	borderRadius: "8px",
	margin: "10px",
	position: "relative",
}))

const StyledSenderMessage = styled(StyledMessage)(() => ({
	marginLeft: "auto",
	backgroundColor: "#dcf8c6",
}))

const StyledReceiverMessage = styled(StyledMessage)(() => ({
	backgroundColor: "whitesmoke",
}))

const StyledTimestamp = styled("span")(() => ({
	color: "gray",
	padding: "10px",
	fontSize: "x-small",
	position: "absolute",
	bottom: 0,
	right: 0,
	textAlign: "right",
}))

const Message = ({ message }: { message: IMessage }) => {
  const { user } = useSelector((state: RootState) => state.auth);

	const MessageType =
		user?.email === message.user
			? StyledSenderMessage
			: StyledReceiverMessage

	return (
		<MessageType>
			{message.text}
			<StyledTimestamp>{message.sent_at}</StyledTimestamp>
		</MessageType>
	)
}

export default Message

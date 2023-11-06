import useRecipient from '@/hooks/useRecipient';
import { styled } from '@mui/material';
import Avatar from '@mui/material/Avatar'

type Props = ReturnType<typeof useRecipient>

const StyledAvatar = styled(Avatar)(() => ({
	margin: "5px 15px 5px 5px"
}));
const RecipientAvatar = ({ recipient, recipientEmail }: Props) => {
	return recipient?.photoURL ? (
		<StyledAvatar src={recipient.photoURL} />
	) : (
		<StyledAvatar>
			{recipientEmail && recipientEmail[0].toUpperCase()}
		</StyledAvatar>
	)
}

export default RecipientAvatar

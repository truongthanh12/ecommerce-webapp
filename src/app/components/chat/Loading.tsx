import Image from 'next/image'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material';

const StyledImageWrapper = styled("div")(() => ({
	marginBottom: "50px"
}));

const StyledContainer = styled("div")(() => ({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	height: "100vh",
}));

const Loading = () => {
	return (
		<StyledContainer>
			<StyledImageWrapper>
				{/* <Image
					src="/ass"
					alt='Whatsapp Logo'
					height='200px'
					width='200px'
				/> */}
				Loading....
			</StyledImageWrapper>

			<CircularProgress />
		</StyledContainer>
	)
}

export default Loading

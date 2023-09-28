import { Avatar, Box, IconButton, styled } from "@mui/material";
import { FlexBox } from "@/components/flex-box";
import Rating from "@/components/Rating";
import { H5, Paragraph, Span } from "@/components/Typography";
import { getDateDifference } from "@/utils/lib";
import React from "react";
import { IComments } from "@/app/models/Product";
import { Delete } from "@mui/icons-material";

// ===========================================================
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[600],
  "& .MuiSvgIcon-root": {
    fontSize: 19,
  },
  ":hover": {
    color: theme.palette.info.main,
  },
}));

const ProductComment: React.FC<any> = ({
  user,
  rating,
  createdAt,
  comment,
  currentId,
  onDelete,
  id
}) => {
  return (
    <Box mb={4} maxWidth="600px">
      <FlexBox alignItems="center" mb={2}>
        <Avatar
          src={user.photoURL}
          sx={{
            width: 48,
            height: 48,
          }}
        />
        <Box mx={2}>
          <H5 mb={0.5}>{user.displayName}</H5>
          <FlexBox alignItems="center">
            <Rating productId={id || ""} />
            <Span ml={2}>{getDateDifference(createdAt)}</Span>
          </FlexBox>
        </Box>
        {user.docId === currentId && (
          <StyledIconButton onClick={onDelete}>
            <Delete />
          </StyledIconButton>
        )}
      </FlexBox>

      <Paragraph color="grey.700">{comment}</Paragraph>
    </Box>
  );
};
export default React.memo(ProductComment);

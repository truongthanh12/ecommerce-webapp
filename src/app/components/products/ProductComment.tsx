import { Avatar, Box } from "@mui/material";
import { FlexBox } from "@/components/flex-box";
import Rating from "@/components/Rating";
import { H5, H6, Paragraph, Span } from "@/components/Typography";
import { getDateDifference } from "@/utils/lib";
import React from "react";

// ===========================================================
interface IComment {
  name: string;
  imgUrl: string;
  rating: number;
  date: string;
  comment: string;
}
const ProductComment = ({ name, imgUrl, rating, date, comment }: IComment) => {
  return (
    <Box mb={4} maxWidth="600px">
      <FlexBox alignItems="center" mb={2}>
        <Avatar
          src={imgUrl}
          sx={{
            width: 48,
            height: 48,
          }}
        />
        <Box ml={2}>
          <H5 mb={0.5}>{name}</H5>
          <FlexBox alignItems="center">
            <Rating value={rating} color="warn" readOnly />
            <H6 mx={1.25}>{rating}</H6>
            <Span>{getDateDifference(date)}</Span>
          </FlexBox>
        </Box>
      </FlexBox>

      <Paragraph color="grey.700">{comment}</Paragraph>
    </Box>
  );
};
export default React.memo(ProductComment);

import { Box, Button, TextField, Rating } from "@mui/material";
import { FlexBox } from "@/components/flex-box";
import ProductComment from "./ProductComment";
import { H2, H5 } from "@/components/Typography";
import React from "react";

// ===================================================

const ProductReview = () => {
  return (
    <Box>
      {commentList.map((item, ind) => (
        <ProductComment {...item} key={ind} />
      ))}

      <H2 fontWeight="600" mt={7} mb={2.5}>
        Write a Review for this product
      </H2>

      <form>
        <Box mb={2.5}>
          <FlexBox mb={1.5} gap={0.5}>
            <H5 color="grey.700">Your Rating</H5>
            <H5 color="error.main">*</H5>
          </FlexBox>

          <Rating color="warn" size="medium" />
        </Box>

        <Box mb={3}>
          <FlexBox mb={1.5} gap={0.5}>
            <H5 color="grey.700">Your Review</H5>
            <H5 color="error.main">*</H5>
          </FlexBox>

          <TextField
            rows={8}
            multiline
            fullWidth
            name="comment"
            variant="outlined"
            placeholder="Write a review here..."
          />
        </Box>

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};
const commentList = [
  {
    name: "Jannie Schumm",
    imgUrl: "/assets/images/faces/7.png",
    rating: 4.7,
    date: "2021-02-14",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account.",
  },
  {
    name: "Joe Kenan",
    imgUrl: "/assets/images/faces/6.png",
    rating: 4.7,
    date: "2019-08-10",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account.",
  },
  {
    name: "Jenifer Tulio",
    imgUrl: "/assets/images/faces/8.png",
    rating: 4.7,
    date: "2021-02-05",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account.",
  },
];

export default React.memo(ProductReview);

import { Box, Button, TextField, Rating } from "@mui/material";
import { FlexBox } from "@/components/flex-box";
import ProductComment from "./ProductComment";
import { H2, H5 } from "@/components/Typography";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { IComments } from "@/app/models/Product";
import { useAppDispatch } from "@/redux/hooks";
import {
  addCommentAsync,
  deleteComment,
  getCommentsByProductId,
} from "@/redux/features/productSlice";
import { setMessage } from "@/redux/features/messageSlice";

const ProductReview = ({ productId }: { productId: string }) => {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch: any = useAppDispatch();
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid },
  } = useForm<any>();

  const [rating, setRating] = useState(0);
  const [flagToRender, setFlagToRender] = useState(false);
  const [comments, setComments] = useState([]);

  const handleChangeRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmitForm = async (values: { comment: string }) => {
    const { comment } = values;
    reset();
    if (comment && rating) {
      if (comment.trim() === "") {
        return;
      }

      setFlagToRender(!flagToRender);
      await dispatch(addCommentAsync({ productId, comment, rating, user }))
        .then(() => {
          dispatch(setMessage({ message: "Added your comment successfully" }));
        })
        .catch((error: any) => {
          dispatch(
            setMessage({
              message: "An error occurred while adding the comment.",
              type: "error",
            })
          );
          throw error;
        });
    } else {
      dispatch(
        setMessage({
          message: "Please typing Your Rating and comment..",
          type: "error",
        })
      );
    }
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(productId, commentId);
    setFlagToRender(!flagToRender);
  };

  useEffect(() => {
    if (productId) {
      getCommentsByProductId(productId)
        .then((res: any) => {
          setComments(res);
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [productId, flagToRender]);

  return (
    <Box>
      {comments.map((item: IComments, ind: number) => (
        <ProductComment
          onDelete={() => handleDeleteComment(item.id)}
          currentId={user.docId}
          {...item}
          key={(item.id || "") + ind}
          id={productId}
        />
      ))}

      {user.docId && (
        <>
          <H2 fontWeight="600" mt={7} mb={2.5}>
            Write a Review for this product
          </H2>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <Box mb={2.5}>
              <FlexBox mb={1.5} gap={0.5}>
                <H5 color="grey.700">Your Rating</H5>
                <H5 color="error.main">*</H5>
              </FlexBox>

              <Rating
                value={rating}
                onChange={(_, newValue) => {
                  handleChangeRating(newValue || 0);
                }}
                color="warn"
                size="medium"
              />
            </Box>

            <Box mb={3}>
              <FlexBox mb={1.5} gap={0.5}>
                <H5 color="grey.700">Your Review</H5>
                <H5 color="error.main">*</H5>
              </FlexBox>

              <Controller
                name="comment"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    minRows={8}
                    multiline
                    fullWidth
                    variant="outlined"
                    placeholder="Write a review here..."
                    value={value}
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
                  />
                )}
              />
            </Box>

            <Button
              disabled={!isDirty || !isValid}
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </>
      )}
    </Box>
  );
};

export default React.memo(ProductReview);

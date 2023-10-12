"use client";
import { getCommentsByProductId } from "@/redux/features/productSlice";
import { Rating } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { IComments } from "../models/Product";

const ProductRating = ({ productId }: { productId: string }) => {
  const [comments, setComments] = useState<IComments[]>([]);

  const averageRating = useMemo(() => {
    let sum = 0;
    let count = 0;

    comments.forEach((comment) => {
      if (comment.rating !== undefined) {
        sum += comment.rating;
        count++;
      }
    });

    if (count === 0) {
      return 0;
    } else {
      return sum / count;
    }
  }, [comments]);

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
  }, [productId]);

  return (
    <Rating
      color="warn"
      size="medium"
      value={averageRating}
      readOnly
      precision={0.5}
    />
  );
};

export default React.memo(ProductRating);

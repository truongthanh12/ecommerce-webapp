"use client";
import React, { useCallback, useState } from "react";
import { Avatar } from "@mui/material";
import { useRouter } from "next/navigation";
import { Delete, Edit } from "@mui/icons-material";
import SwitchButton from "@/components/Switch";
import {
  CategoryWrapper,
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "@/page-sections/admin/styles";
import { useAppDispatch } from "@/redux/hooks";
import { FlexBox } from "@/app/components/flex-box";
import { Paragraph } from "@/app/components/Typography";
import { currency } from "@/app/utils/lib";
import { deleteProductAsync } from "@/redux/features/productSlice";
import { setMessage } from "@/redux/features/messageSlice";

// ========================================================================

const ProductRow = ({ product, selected }: any) => {
  const { title, published, thumbnail, id, categories, price, brands, stock } =
    product || {};
  const router = useRouter();
  const [featuredCategory, setFeaturedCategory] = useState(published);

  const isItemSelected = selected?.indexOf(title) !== -1;
  const handleNavigate = () => router.push(`/vendor/products/${id}`);
  const dispatch: any = useAppDispatch();

  const handleDelete = useCallback(() => {
    dispatch(deleteProductAsync({ productId: id }))
      .then((resultAction: any) => {
        if (deleteProductAsync.fulfilled.match(resultAction)) {
          dispatch(
            setMessage({
              message: "Product deleted successfully",
              type: "success",
            })
          );
        } else if (deleteProductAsync.rejected.match(resultAction)) {
          dispatch(
            setMessage({
              message: "Product cannot delete",
              type: "error",
            })
          );
        }
      })
      .catch((error: any) => {
        console.error("Error:", error);
      });
  }, [id]);

  return (
    <StyledTableRow tabIndex={-1} role="checkbox" selected={isItemSelected}>
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar sx={{borderRadius: "4px", width: 80, height: 80}} src={thumbnail} alt={title} />
          <Paragraph>{title}</Paragraph>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align="center">{stock}</StyledTableCell>
      <StyledTableCell align="center">
        <CategoryWrapper>{categories}</CategoryWrapper>
      </StyledTableCell>
      <StyledTableCell align="center">{brands}</StyledTableCell>
      <StyledTableCell align="center">{currency(price || 0)}</StyledTableCell>

      <StyledTableCell align="center">
        <SwitchButton
          color="info"
          checked={featuredCategory}
          onChange={() => setFeaturedCategory((state: any) => !state)}
        />
      </StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton onClick={handleNavigate}>
          <Edit />
        </StyledIconButton>

        <StyledIconButton onClick={handleDelete}>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};
export default React.memo(ProductRow);

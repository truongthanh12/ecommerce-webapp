"use client";
import React, { useCallback, useState } from "react";
import { Avatar } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import SwitchButton from "@/components/Switch";
import {
  CategoryWrapper,
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "@/page-sections/admin/styles";
import { useAppDispatch } from "@/redux/hooks";
import { FlexBox } from "@/components/flex-box";
import { Paragraph } from "@/components/Typography";
import { currency } from "@/utils/lib";
import { deleteProductAsync } from "@/redux/features/productSlice";
import { setMessage } from "@/redux/features/messageSlice";
import { useSelector } from "react-redux";
import { updateAsync } from "@/redux/features/rechargeSlice";
import { ADMIN_ID } from "@/app/constant";
import { RootState } from "@/redux/store";
import useCustomRouter from "@/hooks/usePushRouter";

// ========================================================================
const ProductRow = ({ product }: any) => {
  const {
    title,
    published,
    thumbnail,
    id,
    categories,
    price,
    brands,
    stock,
    userId,
  } = product || {};
  const { pushRouter } = useCustomRouter();
  const [featured, setFeatured] = useState(published);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleChangeStatus = async () => {
    if (user.docId === ADMIN_ID) {
      setFeatured((state: boolean) => !state);
      const resultAction = await dispatch(
        updateAsync({ id: id || "", docs: "products", newStatus: !featured })
      );

      if (updateAsync.rejected.match(resultAction)) {
        const errorPayload = resultAction.payload;
        dispatch(
          setMessage({
            message: `Error: ${errorPayload}`,
            type: "error",
          })
        );
      } else {
        dispatch(
          setMessage({
            message: "Successfully!",
            type: "success",
          })
        );
      }
    }
  };

  const handleNavigate = () => pushRouter(`vendor/products/${id}`);
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
  }, [dispatch, id]);

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar
            sx={{ borderRadius: "4px", width: 80, height: 80 }}
            src={thumbnail}
            alt={title}
          />
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
          disabled={user.docId !== ADMIN_ID}
          checked={featured}
          onChange={handleChangeStatus}
        />
      </StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton
          onClick={handleNavigate}
          disabled={userId !== user.docId && ADMIN_ID !== user.docId}
        >
          <Edit />
        </StyledIconButton>

        <StyledIconButton
          onClick={handleDelete}
          disabled={user.docId !== ADMIN_ID}
        >
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};
export default React.memo(ProductRow);

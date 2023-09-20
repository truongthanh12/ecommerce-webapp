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
} from "../styles";
import { useAppDispatch } from "@/redux/hooks";
import { setMessage } from "@/redux/features/messageSlice";
import { deleteCategoryAsync } from "@/redux/features/categorySlice";

// ========================================================================

const CategoryRow = ({ category, selected }: any) => {
  const { name, featured, image, id, parent } = category || {};
  const router = useRouter();
  const [featuredCategory, setFeaturedCategory] = useState(featured);

  const isItemSelected = selected?.indexOf(name) !== -1;
  const handleNavigate = () => router.push(`/admin/categories/${id}`);
  const dispatch: any = useAppDispatch();

  const handleDelete = useCallback(() => {
    dispatch(deleteCategoryAsync({ categoryId: id }))
      .then((resultAction: any) => {
        if (deleteCategoryAsync.fulfilled.match(resultAction)) {
          dispatch(
            setMessage({
              message: "Category deleted successfully",
              type: "success",
            })
          );
        } else if (deleteCategoryAsync.rejected.match(resultAction)) {
          dispatch(
            setMessage({
              message: "Category cannot delete",
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
    <StyledTableRow tabIndex={-1} role="checkbox" selected={isItemSelected}>
      <StyledTableCell align="left">#{id?.split("-")[0]}</StyledTableCell>

      <StyledTableCell align="left">
        <CategoryWrapper>{name}</CategoryWrapper>
      </StyledTableCell>

      <StyledTableCell align="left">
        <Avatar
          src={image}
          sx={{
            width: 55,
            height: "auto",
            margin: "auto",
            borderRadius: 0,
          }}
        />
      </StyledTableCell>
      <StyledTableCell align="left">
        <CategoryWrapper>{parent}</CategoryWrapper>
      </StyledTableCell>
      <StyledTableCell align="left">
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
export default React.memo(CategoryRow);

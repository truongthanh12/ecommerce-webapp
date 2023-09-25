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
import { ADMIN_ID } from "@/app/constant";
import { useSelector } from "react-redux";
import { updateAsync } from "@/redux/features/rechargeSlice";
import { ICategory } from "@/app/models/Category";

// ========================================================================

const CategoryRow = ({ category }: { category: Partial<ICategory> }) => {
  const { name, published, image, id, parent, userId } = category || {};
  const router = useRouter();
  const [featuredCategory, setFeaturedCategory] = useState(published);
  const { user } = useSelector((state: any) => state.auth);

  const handleChangeStatus = async () => {
    if (user.docId === ADMIN_ID) {
      setFeaturedCategory((state) => !state);
      const resultAction = await dispatch(
        updateAsync({
          id: id || "",
          docs: "categories",
          newStatus: !featuredCategory,
        })
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

  const handleNavigate = () => router.push(`/admin/categories/${id}`);
  const dispatch: any = useAppDispatch();

  const handleDelete = useCallback(() => {
    dispatch(deleteCategoryAsync({ categoryId: id || "" }))
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
    <StyledTableRow tabIndex={-1} role="checkbox">
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
          disabled={user.docId !== ADMIN_ID}
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
export default React.memo(CategoryRow);

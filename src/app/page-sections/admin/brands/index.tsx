"use client";
import React, { useCallback, useState } from "react";
import { Avatar } from "@mui/material";
import { useRouter } from "next/navigation";
import { Delete, Edit } from "@mui/icons-material";
import SwitchButton from "@/components/Switch";
import { StyledIconButton, StyledTableCell, StyledTableRow } from "../styles";
import { useAppDispatch } from "@/redux/hooks";
import { deleteBrandAsync } from "@/redux/features/brandSlice";
import { setMessage } from "@/redux/features/messageSlice";

// ========================================================================

const BrandRow = ({ brand, selected }: any) => {
  const { name, featured, image, id } = brand || {};
  const router = useRouter();
  const [featuredCategory, setFeaturedCategory] = useState(featured);

  const isItemSelected = selected?.indexOf(name) !== -1;
  const handleNavigate = () => router.push(`/admin/brands/${id}`);
  const dispatch: any = useAppDispatch();

  const handleDelete = useCallback(() => {
    dispatch(deleteBrandAsync({ brandId: id }))
      .then((resultAction: any) => {
        if (deleteBrandAsync.fulfilled.match(resultAction)) {
          dispatch(
            setMessage({
              message: "Brand deleted successfully",
              type: "success",
            })
          );
        } else if (deleteBrandAsync.rejected.match(resultAction)) {
          dispatch(
            setMessage({
              message: "Brand cannot delete",
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
      <StyledTableCell align="center">#{id?.split("-")[0]}</StyledTableCell>

      <StyledTableCell align="center">{name}</StyledTableCell>

      <StyledTableCell align="center">
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
export default React.memo(BrandRow);

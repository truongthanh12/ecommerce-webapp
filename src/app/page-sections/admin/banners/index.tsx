"use client";
import React, { useCallback, useState } from "react";
import { Avatar } from "@mui/material";
import { useRouter } from "next/navigation";
import { Delete, Edit } from "@mui/icons-material";
import SwitchButton from "@/components/Switch";
import { StyledIconButton, StyledTableCell, StyledTableRow } from "../styles";
import { useAppDispatch } from "@/redux/hooks";
import { setMessage } from "@/redux/features/messageSlice";
import { deleteBannerAsync } from "@/redux/features/bannerSlice";

// ========================================================================

const BannerRow = ({ banner, selected }: any) => {
  const { title, featured, imgUrl, id, description } = banner || {};
  const router = useRouter();
  const [featuredCategory, setFeaturedCategory] = useState(featured);

  const isItemSelected = selected?.indexOf(title) !== -1;
  const handleNavigate = () => router.push(`/admin/banners/${id}`);
  const dispatch: any = useAppDispatch();

  const handleDelete = useCallback(() => {
    dispatch(deleteBannerAsync({ bannerId: id }))
      .then((resultAction: any) => {
        if (deleteBannerAsync.fulfilled.match(resultAction)) {
          dispatch(
            setMessage({
              message: "Banner deleted successfully",
              type: "success",
            })
          );
        } else if (deleteBannerAsync.rejected.match(resultAction)) {
          dispatch(
            setMessage({
              message: "Banner cannot delete",
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
      <StyledTableCell align="center">#{id?.split("-")[0]}</StyledTableCell>

      <StyledTableCell align="center">{title}</StyledTableCell>

      <StyledTableCell align="center">
        <Avatar
          src={imgUrl}
          sx={{
            width: 55,
            height: "auto",
            margin: "auto",
            borderRadius: 0,
          }}
        />
      </StyledTableCell>
      <StyledTableCell align="center">{description}</StyledTableCell>
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
export default React.memo(BannerRow);

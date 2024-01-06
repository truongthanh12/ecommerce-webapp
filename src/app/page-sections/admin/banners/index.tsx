"use client";
import React, { useCallback, useState } from "react";
import { Avatar } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import SwitchButton from "@/components/Switch";
import { StyledIconButton, StyledTableCell, StyledTableRow } from "../styles";
import { useAppDispatch } from "@/redux/hooks";
import { setMessage } from "@/redux/features/messageSlice";
import { deleteBannerAsync } from "@/redux/features/bannerSlice";
import { useSelector } from "react-redux";
import { ADMIN_ID } from "@/app/constant";
import { updateAsync } from "@/redux/features/rechargeSlice";
import { ICarouselCard } from "@/models/Brand";
import { RootState } from "@/redux/store";
import useCustomRouter from "@/hooks/usePushRouter";

// ========================================================================

const BannerRow = ({ banner }: { banner: Partial<ICarouselCard> }) => {
  const { title, published, imgUrl, id, description, userId } = banner || {};
  const { pushRouter } = useCustomRouter();
  const [featured, setFeatured] = useState(published);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleNavigate = () => pushRouter(`admin/banners/${id}`);
  const dispatch: any = useAppDispatch();

  const handleChangeStatus = async () => {
    if (user.docId === ADMIN_ID) {
      setFeatured((state) => !state);
      const resultAction = await dispatch(
        updateAsync({
          id: id || "",
          docs: "hero-banners",
          newStatus: !featured,
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

  const handleDelete = useCallback(() => {
    dispatch(deleteBannerAsync({ bannerId: id || "" }))
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
  }, [dispatch, id]);

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
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
          checked={featured}
          disabled={user.docId !== ADMIN_ID}
          onChange={handleChangeStatus}
        />
      </StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton
          onClick={handleNavigate}
          disabled={user.docId !== userId && ADMIN_ID !== user.docId}
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
export default React.memo(BannerRow);

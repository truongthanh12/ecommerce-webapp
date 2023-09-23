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
import { ADMIN_ID } from "@/app/constant";
import { useSelector } from "react-redux";
import { IBrand } from "@/app/models/Brand";
import { updateAsync } from "@/redux/features/rechargeSlice";

// ========================================================================

const BrandRow = ({ brand }: { brand: Partial<IBrand> }) => {
  const { name, published, image, id } = brand || {};
  const router = useRouter();
  const [featuredBrand, setFeatured] = useState(published);
  const { user } = useSelector((state: any) => state.auth);

  const handleChangeStatus = async () => {
    if (user.docId === ADMIN_ID) {
      setFeatured((state) => !state);
      const resultAction = await dispatch(
        updateAsync({ id: id || "", docs: "brands", newStatus: !featuredBrand })
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
  const handleNavigate = () => router.push(`/admin/brands/${id}`);
  const dispatch: any = useAppDispatch();

  const handleDelete = useCallback(() => {
    dispatch(deleteBrandAsync({ brandId: id || "" }))
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
    <StyledTableRow tabIndex={-1} role="checkbox">
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
          checked={featuredBrand}
          onChange={handleChangeStatus}
          disabled={user.docId !== ADMIN_ID}
        />
      </StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton onClick={handleNavigate}>
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
export default React.memo(BrandRow);

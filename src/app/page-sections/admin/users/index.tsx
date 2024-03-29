"use client";
import React, { useCallback, useMemo } from "react";
import { Avatar } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { StyledIconButton, StyledTableCell, StyledTableRow } from "../styles";
import { useAppDispatch } from "@/redux/hooks";
import { FlexBox } from "@/components/flex-box";
import { Paragraph } from "@/components/Typography";
import { deleteUserAsync } from "@/redux/features/authSlice";
import { setMessage } from "@/redux/features/messageSlice";
import { currency } from "@/utils/lib";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// ========================================================================

const UserRow = ({ user, selected }: any) => {
  const {
    displayName,
    phoneNumber,
    photoURL,
    uid,
    email,
    wallet,
    userType,
    docId,
  } = user || {};

  const isItemSelected = useMemo(
    () => selected?.indexOf(displayName) !== -1,
    [selected, displayName]
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch: any = useAppDispatch();

  const handleDelete = useCallback(() => {
    dispatch(deleteUserAsync({ userId: uid }))
      .then((resultAction: any) => {
        if (deleteUserAsync.fulfilled.match(resultAction)) {
          dispatch(
            setMessage({
              message: "User deleted successfully",
              type: "success",
            })
          );
        } else if (deleteUserAsync.rejected.match(resultAction)) {
          dispatch(
            setMessage({
              message: "User cannot delete",
              type: "error",
            })
          );
        }
      })
      .catch((error: any) => {
        console.error("Error:", error);
      });
  }, [dispatch, uid]);

  return (
    <StyledTableRow tabIndex={-1} role="checkbox" selected={isItemSelected}>
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar src={photoURL} />
          <Paragraph>{displayName || "Not updated"}</Paragraph>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        {phoneNumber || "Not updated"}
      </StyledTableCell>
      <StyledTableCell
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        {email}
      </StyledTableCell>
      <StyledTableCell
        align="center"
        sx={{
          fontWeight: 400,
        }}
      >
        {currentUser.docId === docId ? currency(wallet) : "*****"}
      </StyledTableCell>
      <StyledTableCell
        align="center"
        sx={{
          fontWeight: 400,
        }}
      >
        {userType || "No"}
      </StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton
          disabled={currentUser.docId !== docId}
          onClick={handleDelete}
        >
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};
export default React.memo(UserRow);

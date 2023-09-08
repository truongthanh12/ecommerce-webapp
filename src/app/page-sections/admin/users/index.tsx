"use client";
import React, { useCallback } from "react";
import { Avatar } from "@mui/material";
import { Delete } from "@mui/icons-material";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../styles";
import { useAppDispatch } from "@/redux/hooks";
import { FlexBox } from "@/app/components/flex-box";
import { Paragraph } from "@/app/components/Typography";
import { deleteUserAsync } from "@/redux/features/authSlice";
import { setMessage } from "@/redux/features/messageSlice";

// ========================================================================

const UserRow = ({ user, selected }: any) => {
  const { displayName, phoneNumber, photoURL, uid, email } = user || {};

  const isItemSelected = selected?.indexOf(displayName) !== -1;
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
  }, [uid]);

  return (
    <StyledTableRow tabIndex={-1} role="checkbox" selected={isItemSelected}>
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar src={photoURL} />
          <Paragraph>{displayName || ""}</Paragraph>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        {phoneNumber}
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
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        {/* {email} */}
      </StyledTableCell>
      <StyledTableCell
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        {/* {email} */}
      </StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton onClick={handleDelete}>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};
export default React.memo(UserRow);

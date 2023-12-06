"use client";
import React, { useCallback, useState } from "react";
import { Delete } from "@mui/icons-material";
import { StyledIconButton, StyledTableCell, StyledTableRow } from "../styles";
import { useAppDispatch } from "@/redux/hooks";
import { FlexBox } from "@/components/flex-box";
import { setMessage } from "@/redux/features/messageSlice";
import {
  deleteChargeAsync,
  updateChargeAsync,
} from "@/redux/features/rechargeSlice";
import { currency } from "@/utils/lib";
import SwitchButton from "@/components/Switch";
import {
  updateUserAsync,
  updateUserWalletAsync,
} from "@/redux/features/authSlice";
import { ADMIN_ID } from "@/app/constant";

// ========================================================================

const RechargeRow = ({ recharge, user }: any) => {
  const dispatch: any = useAppDispatch();
  const [featured, setFeatured] = useState(recharge.pending);

  const handleChangeStatus = async () => {
    if (user.docId === ADMIN_ID) {
      setFeatured((state: boolean) => !state);
      const data = { wallet: recharge.amount };
      const resultAction = await dispatch(
        updateChargeAsync({ rechargeId: recharge.id })
      );

      if (updateUserAsync.rejected.match(resultAction)) {
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
            message: "User recharged successfully!",
            type: "success",
          })
        );
        await dispatch(
          updateUserWalletAsync({
            userId: recharge.userId,
            amount: data.wallet,
          })
        );
      }
    }
  };
  const handleDelete = useCallback(() => {
    dispatch(deleteChargeAsync({ chargeId: recharge.id }))
      .then((resultAction: any) => {
        if (deleteChargeAsync.fulfilled.match(resultAction)) {
          dispatch(
            setMessage({
              message: "Request deleted successfully",
              type: "success",
            })
          );
        } else if (deleteChargeAsync.rejected.match(resultAction)) {
          dispatch(
            setMessage({
              message: "Request cannot delete",
              type: "error",
            })
          );
        }
      })
      .catch((error: any) => {
        console.error("Error:", error);
      });
  }, [dispatch, recharge.id]);

  return (
    <StyledTableRow tabIndex={-1} role="checkbox" selected={featured}>
      <StyledTableCell align="center">
        <FlexBox alignItems="center" gap={1.5}>
          {recharge.id}
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell
        align="center"
        sx={{
          fontWeight: 400,
        }}
      >
        {currency(recharge.amount)}
      </StyledTableCell>
      <StyledTableCell
        align="center"
        sx={{
          fontWeight: 400,
        }}
      >
        <SwitchButton
          color="info"
          disabled={featured || user.docId !== ADMIN_ID}
          checked={featured}
          onChange={handleChangeStatus}
        />
      </StyledTableCell>

      <StyledTableCell align="center">
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
export default React.memo(RechargeRow);

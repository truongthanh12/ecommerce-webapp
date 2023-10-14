"use client";
import React, { useCallback } from "react";
import { Delete, Edit } from "@mui/icons-material";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "@/page-sections/admin/styles";
import { useAppDispatch } from "@/redux/hooks";
import { setMessage } from "@/redux/features/messageSlice";
import { deleteVoucherAsync } from "@/redux/features/voucherSlice";
import { currency } from "@/utils/lib";
import useCustomRouter from "@/hooks/usePushRouter";

// ========================================================================

const VoucherRow = ({ voucher }: any) => {
  const {
    name,
    discountAmount,
    discountPercent,
    discountMax,
    amount,
    id,
    totalBill,
  } = voucher || {};
  const { pushRouter } = useCustomRouter();

  const handleNavigate = () => pushRouter(`/vendor/vouchers/${id}`);
  const dispatch: any = useAppDispatch();

  const handleDelete = useCallback(() => {
    dispatch(deleteVoucherAsync({ voucherId: id }))
      .then((resultAction: any) => {
        if (deleteVoucherAsync.fulfilled.match(resultAction)) {
          dispatch(
            setMessage({
              message: "Voucher deleted successfully",
              type: "success",
            })
          );
        } else if (deleteVoucherAsync.rejected.match(resultAction)) {
          dispatch(
            setMessage({
              message: "Voucher cannot delete",
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
    <StyledTableRow tabIndex={-1}>
      <StyledTableCell align="center">#{id?.split("-")[0]}</StyledTableCell>

      <StyledTableCell align="center">{name}</StyledTableCell>

      <StyledTableCell align="center">
        Bill{" >= " + currency(totalBill)}
      </StyledTableCell>
      <StyledTableCell align="center">{amount}</StyledTableCell>
      <StyledTableCell align="center">
        {discountAmount ||
          " " + discountPercent + "%" + " - " + currency(discountMax)}
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
export default React.memo(VoucherRow);

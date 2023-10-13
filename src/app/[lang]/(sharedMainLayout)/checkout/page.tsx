"use client";
import { Grid } from "@mui/material";
import SEO from "@/components/SEO";
import CheckoutForm from "@/page-sections/checkout/CheckoutForm";
import CheckoutNavLayout from "@/components/layouts/CheckoutNavLayout";
import CheckoutSummary from "@/page-sections/checkout/CheckoutSummary";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectCartItemsForUser } from "@/redux/features/cartSlice";
import { IVoucher } from "@/app/models/Voucher";
import { RootState } from "@/redux/store";

export default function Checkout() {
  const { user } = useSelector((state: RootState) => state.auth);
  const cartList: any = useSelector(selectCartItemsForUser(user.docId));
  const { vouchers } = useSelector((state: RootState) => state.vouchers);

  const [voucher, setVoucher] = useState("");

  const userType = useMemo(() => {
    const userTypes = cartList
      ?.filter((item: any) => item?.product?.shop?.userType)
      ?.map((item: any) => item?.product?.shop?.userType);

    if (userTypes?.includes("Premium")) {
      return "Premium";
    } else if (userTypes?.includes("Gold")) {
      return "Gold";
    } else {
      return "Silver";
    }
  }, [cartList]);

  const foundVoucher = useMemo(
    () => vouchers.find((v: IVoucher) => v.name === voucher),
    [vouchers, voucher]
  );

  const totalVoucherDeduction = useMemo(
    () =>
      cartList.reduce(
        (accum: number, item: any) =>
          accum + item.product.voucherSelected * 1000,
        0
      ),
    [cartList]
  );

  const getTotalPrice = useMemo(() => {
    return cartList.reduce((accum: number, item: any) => {
      return accum + item.product.price * item.quantity;
    }, 0);
  }, [cartList]);

  const getPriceDiscount = useMemo(() => {
    return cartList.reduce((accum: number, item: any) => {
      return accum + item.product.price * (item.product.discount / 100);
    }, 0);
  }, [cartList]);

  const calcCodeVoucher = useMemo(() => {
    if (foundVoucher) {
      return cartList.reduce((accum: number, item: any) => {
        if (item.product.voucherSelected > 0) {
          const discount =
            item.product.price * (foundVoucher.discountPercent / 100);

          if (getTotalPrice > foundVoucher.discountMax) {
            return accum + foundVoucher.discountMax;
          } else {
            return accum + discount;
          }
        } else {
          return accum;
        }
      }, 0);
    }
  }, [foundVoucher, cartList, getTotalPrice]);

  const getTotalPriceDiscount = useMemo(() => {
    const shippingFee = 30000;
    return (
      cartList.reduce((accum: number, item: any) => {
        return (
          accum +
          Number(
            item.product.price -
              item.product.price * (item.product.discount / 100)
          ) *
            item.quantity +
          item.product.price * 0.1 +
          shippingFee
        );
      }, 0) -
      totalVoucherDeduction -
      (calcCodeVoucher || 0) -
      (userType === "Premium" ? 20000 : userType === "Gold" ? 15000 : 10000)
    );
  }, [cartList, totalVoucherDeduction, calcCodeVoucher, userType]);

  if (!user?.uid) {
    return null
  }
  
  return (
    <CheckoutNavLayout>
      <SEO title="Checkout" />
      <Grid container flexWrap="wrap-reverse" spacing={3}>
        <Grid item lg={8} md={8} xs={12}>
          <CheckoutForm
            cartList={cartList}
            user={user}
            total={getTotalPriceDiscount}
          />
        </Grid>

        <Grid item lg={4} md={4} xs={12}>
          <CheckoutSummary
            isOnlyInfo
            vouchers={vouchers}
            foundVoucher={foundVoucher}
            getPriceDiscount={getPriceDiscount}
            getTotalPrice={getTotalPrice}
            getTotalPriceDiscount={getTotalPriceDiscount}
            totalVoucherDeduction={totalVoucherDeduction}
            userType={userType}
            calcCodeVoucher={calcCodeVoucher}
            voucher={voucher}
            setVoucher={setVoucher}
          />
        </Grid>
      </Grid>
    </CheckoutNavLayout>
  );
}

"use client";
import { Box, Button, Grid } from "@mui/material";
import { H3 } from "@/components/Typography";
import { doc, getDoc } from "firebase/firestore";
import db from "@/firebase";
import { useEffect, useMemo, useState } from "react";
import { FlexBox } from "@/components/flex-box";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";
import OrderedProductList from "@/page-sections/orders/OrderedProductList";
import OrderedSummary from "@/page-sections/orders/OrderedSummary";
import FiledItem from "@/page-sections/vendor/products/Item";
import { tryFormatDate } from "@/app/utils/lib";
import { Controller, useForm } from "react-hook-form";
import { ORDER_STATUS } from "@/app/data/status";
import { updateAsync } from "@/redux/features/orderSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setMessage } from "@/redux/features/messageSlice";
import { useRouter } from "next/navigation";

// =============================================================================
interface TypeProps {
  params: { id: string };
}
async function getOrderId(id = "") {
  try {
    const orderDocRef = doc(db, "orders", id);
    const orderDocSnapshot = await getDoc(orderDocRef);

    if (orderDocSnapshot.exists()) {
      const orderData = orderDocSnapshot.data();
      return orderData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching brand:", error);
    return null;
  }
}

export default function EditOrder({ params }: TypeProps) {
  const dispatch: any = useAppDispatch();
  const { id } = params;
  const [order, setOrder] = useState<any>({});
  const router = useRouter()
  const {
    control,
    reset,
    formState: { isDirty, isValid },
    handleSubmit,
  } = useForm<any>({ defaultValues: { status: order.status } });

  const formattedDate = useMemo(
    () => (order?.createdAt ? tryFormatDate(order?.createdAt) : ""),
    [order?.createdAt]
  );

  const handleUpdateStatus = (values: { status: string }) => {
    const { status } = values || {};
    dispatch(updateAsync({ orderId: id, newStatus: status }))
      .unwrap()
      .then((response: any) => {
        dispatch(
          setMessage({
            message: `Updated this status order to ${response.status}`,
            type: "success",
          })
        );
        router.push("/vendor/orders")
      })
      .catch((error: any) => {
        dispatch(
          setMessage({
            message: `Updated this status order error: ${error}`,
            type: "error",
          })
        );
      });
  };

  useEffect(() => {
    async function fetchData() {
      const brand = await getOrderId(id);
      setOrder(brand || {});
    }

    fetchData();
  }, [id]);
  useEffect(() => {
    if (order) {
      reset({
        status: order.status || "",
      });
    }
  }, [order, reset]);

  return (
    <Box py={4}>
      <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
        <H3 mb={2}>Edit order "{id}"</H3>
        <Link href="/vendor/orders">
          <Button
            color="info"
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{
              minHeight: 44,
            }}
          >
            Back
          </Button>
        </Link>
      </FlexBox>

      <Grid item xs={12} sx={{ py: 3 }}>
        <Controller
          name="status"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FiledItem
              value={value || []}
              data={ORDER_STATUS}
              error={error}
              label="Select Status"
              name="Status"
              onChange={onChange}
              isSelect
            />
          )}
        />
      </Grid>
      {/* ORDERED PRODUCT LIST */}
      <OrderedProductList
        params={params}
        order={order}
        formattedDate={formattedDate}
      />

      {/* SHIPPING AND ORDER SUMMERY */}
      <OrderedSummary order={order} />
      <Grid justifyContent="flex-end" container item xs={12} sx={{ pt: 2.5 }}>
        <Button
          variant="contained"
          color="info"
          type="submit"
          disabled={!isDirty && !isValid}
          onClick={handleSubmit(handleUpdateStatus)}
        >
          Submit
        </Button>
      </Grid>
    </Box>
  );
}

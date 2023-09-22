import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addToCart, selectCartItemsForUser } from "@/redux/features/cartSlice";
import { Box, Button } from "@mui/material";
import { FlexBox } from "@/components/flex-box";
import { Add, Remove } from "@mui/icons-material";

const CartAction = ({
  product,
  isIncludeBtnAdd,
}: {
  isIncludeBtnAdd?: boolean;
  product: any;
}) => {
  const { stock, id, size, color, voucherSelected } = product || {};

  const { user } = useSelector((state: any) => state.auth);
  const userCartItems = useSelector(selectCartItemsForUser(user.docId));

  const dispatch: AppDispatch = useDispatch();

  const isInStock = useMemo(() => {
    return Number(stock) > 0;
  }, [stock]);

  // Function to add an item to the cart
  const addItemToCart = (quantity: number) => {
    dispatch(
      addToCart({
        product,
        userId: user.docId,
        quantity,
        size,
        color,
        stock,
        voucherSelected
      })
    );
  };

  // Get the current quantity of this item in the cart
  const currentItemInCart = userCartItems
    ? userCartItems?.find(
        (item: any) =>
          item.product.id === id &&
          item.product.size === size &&
          item.product.color === color
      )
    : null;

  return (
    <FlexBox
      alignItems="center"
      flexDirection={isIncludeBtnAdd ? "column" : "row"}
      mb={2}
    >
      {currentItemInCart ? (
        <>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => addItemToCart(1)}
            disabled={!isInStock}
            sx={{
              height: "32px",
              width: "32px",
              borderRadius: "300px",
            }}
          >
            <Add fontSize="small" />
          </Button>

          <Box fontWeight={600} fontSize="15px" my="6px" mx="12px">
            {currentItemInCart ? currentItemInCart.quantity : 0}
          </Box>

          <Button
            color="primary"
            variant="outlined"
            disabled={!currentItemInCart || currentItemInCart.quantity === 1}
            onClick={() => addItemToCart(-1)}
            sx={{
              height: "32px",
              width: "32px",
              borderRadius: "300px",
            }}
          >
            <Remove fontSize="small" />
          </Button>
        </>
      ) : (
        <Button
          color="primary"
          variant="contained"
          onClick={() => addItemToCart(1)}
          disabled={!isInStock}
          sx={{
            mb: 4.5,
            px: "1.75rem",
            height: 40,
          }}
        >
          Add to Cart
        </Button>
      )}
    </FlexBox>
  );
};

export default React.memo(CartAction);

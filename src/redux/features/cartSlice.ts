import { IProducts } from "@/app/models/Product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  product: Partial<IProducts>; // Unique identifier for the product
  userId: string; // Unique identifier for the user
  quantity: number; // Quantity of the product in the cart
  size?: string;
  color?: string;
  stock: number;
  dispatch?: any;
}

const initialState = {
  items: [] as CartItem[],
  message: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { product, userId, quantity, size, color, stock } = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.product.id === product.id &&
          item.userId === userId &&
          ((item.size === size && item.color === color) ||
            (!item.size && !item.color))
      );

      if (existingItem) {
        // Update quantity if item exists
        if (quantity === 1) {
          if (existingItem.quantity < stock) {
            existingItem.quantity += quantity;
            return;
          }
          return;
        }
        existingItem.quantity += quantity;
      } else {
        // Add a new item to the cart
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      const { product, userId, size, color } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(
            item.product.id === product.id &&
            item.userId === userId &&
            ((item.size === size && item.color === color) ||
              (!item.size && !item.color))
          )
      );
    },

    clearItemsInCart: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      // Remove all items in the cart for the specified user
      state.items = state.items.filter((item) => item.userId !== userId);
    },
  },
});
import { createSelector } from "reselect";
import { setMessage } from "./messageSlice";

// Assuming you have a selector to get all cart items
const selectCartItems = (state: any) => state.carts.items;

// Create a selector to get cart items for a specific user
export const selectCartItemsForUser = (userId: string) =>
  createSelector([selectCartItems], (cartItems) =>
    cartItems.filter((item: any) => item.userId === userId)
  );

// Select the user carts from the Redux store
const selectUserCarts = (state: any) => state.carts.items;

// Create a selector that calculates the total quantity for a specific user
export const selectTotalQuantityForUser = (userId: string) =>
  createSelector([selectUserCarts], (userCarts) => {
    // Find the user's cart based on userId
    const userCart = userCarts.filter((cart: any) => cart.userId === userId);

    if (userCart) {
      // Calculate the total quantity for that user's cart
      return userCart.reduce(
        (total: number, cartItem: any) => total + cartItem.quantity,
        0
      );
    }

    // Return 0 if the user's cart is not found
    return 0;
  });

export const { addToCart, removeFromCart, clearItemsInCart } =
  cartSlice.actions;
export default cartSlice.reducer;

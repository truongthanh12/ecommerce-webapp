import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import db from "@/firebase"; // Import your Firebase configuration
import { doc, getDoc } from "firebase/firestore";

// Define the state type
interface WishlistState {
  items: any[]; // Replace 'any' with the type of your wishlist items
  loading: boolean;
  error: any;
}

// Initial state
const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Define an async thunk to fetch wishlist items by userId
export const fetchWishlistByUserId = createAsyncThunk(
  "wishlist/fetchWishlistByUserId",
  async (userId: string, { rejectWithValue }) => {
    try {
      // Fetch the wishlist data for the user from Firestore
      const wishlistRef = doc(db, "wishlist", userId);
      const wishlistDoc = await getDoc(wishlistRef);

      if (wishlistDoc.exists()) {
        return wishlistDoc.data()?.items || [];
      } else {
        // If the user doesn't have a wishlist yet, return an empty array
        return [];
      }
    } catch (error) {
      return rejectWithValue("An error occurred while fetching the wishlist.");
    }
  }
);

// Define the wishlist slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItemToWishlist: (state, action) => {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex === -1) {
        state.items.push(action.payload);
      }
    },
    removeItemFromWishlist: (state, action) => {
      const indexToRemove = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (indexToRemove !== -1) {
        state.items.splice(indexToRemove, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistByUserId.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlistByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions and reducer
export const { addItemToWishlist, removeItemFromWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;

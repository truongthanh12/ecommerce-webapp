import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import db from "@/firebase";
import { IProducts } from "@/models/Product";
import { formatTimestamp } from "@/app/utils/lib";

// wishlist
export const addWishlistAsync = createAsyncThunk(
  "products/addWishlistAsync",
  async ({
    userId,
    products,
  }: {
    userId: string;
    products: Partial<IProducts>;
  }) => {
    try {
      const userRef = doc(collection(db, "users"), userId);
      const createdAt = formatTimestamp();

      const wishlistData = {
        products,
        createdAt,
        userId,
      };

      const wishlistRef = await addDoc(
        collection(userRef, "wishlist"),
        wishlistData
      );

      // Update the wishlist data with the generated document ID
      const wishlistWithId = {
        id: wishlistRef.id,
        ...wishlistData,
      };

      return wishlistWithId;
    } catch (error) {
      throw error;
    }
  }
);

export const getWishlistByUserId = createAsyncThunk(
  "products/getWishlistByUserId",
  async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const wishlistsRef = collection(userRef, "wishlist");
      const querySnapshot = await getDocs(wishlistsRef);

      const wishlists: any[] = [];

      querySnapshot.forEach((doc) => {
        const wishlistData = doc.data();
        const wishlistWithId = {
          id: doc.id,
          ...wishlistData,
        };
        wishlists.unshift(wishlistWithId);
      });

      return wishlists;
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      throw error;
    }
  }
);

export const deleteWishlistAsync = createAsyncThunk(
  "products/deleteWishlistAsync",
  async ({ wishlistId, userId }: { wishlistId: string; userId: string }) => {
    try {
      const wislistRef = doc(db, "users", userId);
      const wishlistsRef = collection(wislistRef, "wishlist");
      const wishlistDocRef = doc(wishlistsRef, wishlistId);

      await deleteDoc(wishlistDocRef);

      return true;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  "users/deleteUserAsync",
  async ({ userId }: { userId: string }, { rejectWithValue }) => {
    try {
      const brandRef = doc(db, "users", userId);

      await deleteDoc(brandRef);

      return userId;
    } catch (error) {
      return rejectWithValue("An error occurred while deleting the brand.");
    }
  }
);
export const updateUserAsync = createAsyncThunk(
  "users/updateUserAsync",
  async (
    { id, updateUser }: { id: string; updateUser: any },
    { rejectWithValue }
  ) => {
    try {
      const bannerRef = doc(db, "users", id);
      await updateDoc(bannerRef, updateUser);

      return { id, ...updateUser };
    } catch (error) {
      return rejectWithValue("An error occurred while updating the user.");
    }
  }
);
type InitialState = {
  user: any;
  isLoading: boolean;
  error: any;
  users: any;
  wishlist: any;
};
const initialState: InitialState = {
  user: {},
  isLoading: false,
  error: {},
  users: [],
  wishlist: [],
};

export const userSlice: any = createSlice({
  name: "user",
  initialState,
  reducers: {
    loading: (state) => {
      state.isLoading = true;
    },
    login: (state, action) => {
      state.isLoading = false;
      state.error = {};
      state.user = action.payload;
    },
    loginError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setUsers: (state, action: PayloadAction<any>) => {
      state.users = action.payload;
      state.isLoading = false;
      state.error = {};
    },
    logout: (state) => {
      state.user = {};
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteUserAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.error = {};
        state.users = state.users.filter(
          (user: any) => user.uid !== action.payload
        );
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || {};
      })
      .addCase(updateUserAsync.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(updateUserAsync.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        const userIndex = state.users.findIndex(
          (user: any) => user.uid === action.payload
        );
        if (userIndex !== -1) {
          state.users[userIndex] = {
            ...state.users[userIndex],
            ...action.payload,
          };
        }
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserAsync.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addWishlistAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addWishlistAsync.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getWishlistByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWishlistByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = {};
        state.user = { ...state.user, wishlist: action.payload };
      })
      .addCase(getWishlistByUserId.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteWishlistAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteWishlistAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteWishlistAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || {};
      });
  },
});

export const { login, logout, loading, loginError, setUsers } =
  userSlice.actions;

//data saved in store
type TypeUserData = {
  data: any;
  optionalData?: { isVendor: boolean };
};
export const userData = ({ data, optionalData }: TypeUserData) => {
  const isVendor = optionalData?.isVendor ?? false; // Use optional chaining and nullish coalescing

  const vendorData = isVendor
    ? {
        facebook: "",
        youtube: "",
        description: "",
        shipping: "",
        pictureCover: "",
      }
    : {};

  // Convert Timestamp to milliseconds for createdAt
  const createdAt = data?.user?.createdAt
    ? data.user.createdAt
    : formatTimestamp();
  return {
    ...vendorData,
    email: data?.user?.email || "",
    uid: data?.user?.uid,
    displayName: data?.user?.displayName || "",
    photoURL: data?.user?.photoURL || "",
    emailVerified: data?.user?.emailVerified,
    phoneNumber: data?.user?.phoneNumber || "",
    birthDate: "",
    isVendor: isVendor || false,
    docId: data?.user?.docId || "",
    address: "",
    createdAt,
  };
};

export const updateUserWalletAsync = createAsyncThunk(
  "users/updateUserWallet",
  async ({ userId, amount }: { userId: string; amount: number }) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        wallet: amount,
      });

      return { userId, amount };
    } catch (error) {
      throw error;
    }
  }
);

export const updateUserData = (
  data: any,
  isVendor?: boolean,
  currentUser?: any,
  isBuyPackage?: boolean
) => {
  const currentDate = new Date();

  // Calculate 30 days in milliseconds
  const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  // Calculate the future timestamp
  const futureTimestamp = new Date(currentDate.getTime() + thirtyDaysInMillis);

  const vendorData = isVendor
    ? {
        facebook: data?.facebook || currentUser?.facebook || "",
        youtube: data?.youtube || currentUser?.youtube || "",
        description: data?.description || currentUser?.description || "",
        shipping: data?.shipping || currentUser?.shipping || "",
        pictureCover: data?.pictureCover || currentUser?.pictureCover || "",
        wallet: Number(currentUser?.wallet + data?.wallet) || 0,
        userType: data?.userType || currentUser?.userType,
        expiredPackage: isBuyPackage
          ? data?.expiredPackage || futureTimestamp
          : currentUser?.expiredPackage,
        updatedAt: currentDate.toISOString(),
      }
    : {};

  return {
    ...vendorData,
    email: data?.email || currentUser?.email || "",
    docId: data?.docId || currentUser?.docId || "",
    displayName: data?.displayName || currentUser?.displayName || "",
    photoURL: data?.photoURL || currentUser?.photoURL || "",
    phoneNumber: data?.phoneNumber || currentUser?.phoneNumber || "",
    birthDate: data?.birthDate || currentUser?.birthDate || "",
    address: data?.address || currentUser?.address || "",
    updatedAt: currentDate.toISOString(),
  };
};

export const fetchUsers =
  ({ isVendor = false }: { isVendor?: boolean }) =>
  async (dispatch: AppDispatch) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("isVendor", "==", isVendor));
      const querySnapshot = await getDocs(q);

      const users: any[] = [];
      querySnapshot.forEach((doc) => {
        const usersData = doc.data() as any;
        const docId = doc.id;
        const userWithId = { ...usersData, docId };
        users.push(userWithId);
      });

      dispatch(setUsers(users));
    } catch (error) {
      throw error;
    }
  };

export default userSlice.reducer;

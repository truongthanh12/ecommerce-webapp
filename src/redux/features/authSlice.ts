import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import db from "@/firebase";

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

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    isLoading: false,
    error: {},
    users: [],
  },
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

  return {
    ...vendorData,
    email: data.user.email || "",
    uid: data.user.uid,
    displayName: data.user.displayName || "",
    photoURL: data.user.photoURL || "",
    emailVerified: data.user.emailVerified,
    phoneNumber: data.user.phoneNumber || "",
    birthDate: "",
    isVendor: isVendor || false,
    docId: data.user.docId || "",
    address: "",
    createdAt: serverTimestamp(),
  };
};
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
        facebook: currentUser.facebook || data.facebook || "",
        youtube: currentUser.youtube || data.youtube || "",
        description: currentUser.description || data.description || "",
        shipping: currentUser.shipping || data.shipping || "",
        pictureCover: currentUser.pictureCover || data.pictureCover || "",
        wallet: Number(currentUser.wallet + data.wallet) || 0,
        userType: data.userType || currentUser.userType,
        expiredPackage: isBuyPackage
          ? data.expiredPackage || futureTimestamp
          : currentUser.expiredPackage,
      }
    : {};

  return {
    ...vendorData,
    email: currentUser.email || data.email || "",
    docId: currentUser.docId || data.docId || "",
    displayName: currentUser.displayName || data.displayName || "",
    photoURL: currentUser.photoURL || data.photoURL || "",
    phoneNumber: currentUser.phoneNumber || data.phoneNumber || "",
    birthDate: currentUser.birthDate || data.birthDate || "",
    address: currentUser.address || data.address || "",
    updatedAt: serverTimestamp(),
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

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "@/redux/store";
import { createSelector } from "reselect";
import db from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { IVoucher } from "@/models/Voucher";

interface VoucherState {
  vouchers: IVoucher[];
  loading: boolean;
  error: any;
}

const initialState: VoucherState = {
  vouchers: [],
  loading: false,
  error: null,
};

export const addVoucherAsync = createAsyncThunk(
  "vouchers/addVoucherAsync",
  async (voucherData: any) => {
    try {
      const voucherRef = collection(db, "vouchers");
      const docRef = await addDoc(voucherRef, voucherData);
      const id = docRef.id;
      return { ...voucherData, id };
    } catch (error) {
      throw error;
    }
  }
);

export const deleteVoucherAsync = createAsyncThunk(
  "vouchers/deleteVoucherAsync",
  async ({ voucherId }: { voucherId: string }, { rejectWithValue }) => {
    try {
      const voucherRef = doc(db, "vouchers", voucherId);

      await deleteDoc(voucherRef);

      return voucherId;
    } catch (error) {
      return rejectWithValue("An error occurred while deleting the voucher.");
    }
  }
);

export const updateVoucherAsync = createAsyncThunk(
  "vouchers/updateVoucherAsync",
  async (
    { id, updateVoucher }: { id: string; updateVoucher: any },
    { rejectWithValue }
  ) => {
    try {
      const voucherRef = doc(db, "vouchers", id);
      await updateDoc(voucherRef, updateVoucher);
      return { id, ...updateVoucher };
    } catch (error) {
      return rejectWithValue("An error occurred while updating the voucher.");
    }
  }
);

const voucherSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setVouchers: (state, action: PayloadAction<IVoucher[]>) => {
      state.vouchers = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addVoucherAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addVoucherAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.vouchers.push(action.payload);
      })
      .addCase(addVoucherAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteVoucherAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteVoucherAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = null;
        state.vouchers = state.vouchers.filter(
          (voucher) => voucher.id !== action.payload
        );
      })
      .addCase(deleteVoucherAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateVoucherAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVoucherAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVoucherIndex = state.vouchers.findIndex(
          (voucher) => voucher.id === action.payload
        );
        if (updatedVoucherIndex !== -1) {
          state.vouchers[updatedVoucherIndex] = action.payload;
        }
      })
      .addCase(updateVoucherAsync.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoading, setVouchers, setError } = voucherSlice.actions;

export const fetchVouchers = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    // Update to use the new query and getDocs function
    const vouchersRef = collection(db, "vouchers");
    const querySnapshot = await getDocs(vouchersRef);

    const vouchers: IVoucher[] = [];
    querySnapshot.forEach((doc) => {
      const vouchersData = doc.data() as IVoucher;
      const id = doc.id;
      const voucherWithId = { ...vouchersData, id };
      vouchers.push(voucherWithId);
    });

    dispatch(setVouchers(vouchers));
  } catch (error) {
    dispatch(setError("An error occurred while fetching vouchers."));
  }
};

const selectVoucherItems = (state: any) => state.vouchers.vouchers;

// Create a selector to get cart items for a specific user
export const selectVoucherForUser = createSelector(
  [selectVoucherItems, (state: any, userId: string) => userId],
  (voucherItems, userId) =>
    voucherItems.filter((item: Partial<IVoucher>) => item.userId === userId)
);

export const voucherDataForm = (data: Partial<IVoucher>, userId: string) => {
  return {
    name: data.name,
    amount: data.amount,
    discountMax: data.discountMax,
    discountPercent: data.discountPercent,
    totalBill: data.totalBill,
    userId: userId,
  };
};

export default voucherSlice.reducer;

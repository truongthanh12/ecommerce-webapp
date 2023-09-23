import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "@/redux/store";
import db from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

interface ReChargeState {
  id?: string;
  pending: boolean;
  amount: number;
  userId?: string;
  createdAt: string;
}

interface ReChargeStateProps {
  recharge: ReChargeState[];
  loading: boolean;
  error: any;
}

const initialState: ReChargeStateProps = {
  recharge: [],
  loading: false,
  error: null,
};

export const addChargeAsync = createAsyncThunk(
  "recharge/addChargeAsync",
  async (chargeData: any) => {
    try {
      const chargeRef = collection(db, "recharges");
      const docRef = await addDoc(chargeRef, chargeData);
      const id = docRef.id;
      return { ...chargeData, id };
    } catch (error) {
      throw error;
    }
  }
);

export const deleteChargeAsync = createAsyncThunk(
  "recharge/deletechargeAsync",
  async ({ chargeId }: { chargeId: string }, { rejectWithValue }) => {
    try {
      const chargeRef = doc(db, "recharges", chargeId);

      await deleteDoc(chargeRef);

      return chargeId;
    } catch (error) {
      return rejectWithValue("An error occurred while deleting the charge.");
    }
  }
);

export const updateChargeAsync = createAsyncThunk(
  "recharge/updateStatus",
  async ({ rechargeId }: { rechargeId: string }) => {
    try {
      const orderDocRef = doc(collection(db, "recharges"), rechargeId);
      const updateData: { pending: boolean } = {
        pending: true,
      };

      await setDoc(orderDocRef, updateData, { merge: true });

      return { id: rechargeId };
    } catch (error) {
      throw error;
    }
  }
);

export const updateAsync = createAsyncThunk(
  "update/updateStatus",
  async ({
    id,
    docs,
    newStatus,
  }: {
    id: string;
    docs: string;
    newStatus: boolean;
  }) => {
    try {
      const docRef = doc(collection(db, docs), id);
      const updateData: { published: boolean } = {
        published: newStatus,
      };

      await setDoc(docRef, updateData, { merge: true });

      return { id };
    } catch (error) {
      throw error;
    }
  }
);

const chargeSlice = createSlice({
  name: "charges",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCharge: (state, action: PayloadAction<ReChargeState[]>) => {
      state.recharge = action.payload;
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
      .addCase(addChargeAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addChargeAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.recharge.push(action.payload);
      })
      .addCase(addChargeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteChargeAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteChargeAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = null;
        state.recharge = state.recharge.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteChargeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoading, setCharge, setError } = chargeSlice.actions;

export const fetchRecharge =
  (userId?: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      const rechargeRef = collection(db, "recharges");

      let queryRef: any = rechargeRef;

      if (userId) {
        queryRef = query(rechargeRef, where("userId", "==", userId));
      }

      const querySnapshot = await getDocs(queryRef);

      const recharge: any = [];
      querySnapshot.forEach((doc) => {
        const rechargeData = doc.data() as Partial<ReChargeState>;
        const id = doc.id;
        const rechargeWithId = { ...rechargeData, id };
        recharge.push(rechargeWithId);
      });

      dispatch(setCharge(recharge));
    } catch (error) {
      dispatch(setError("An error occurred while fetching recharge."));
    }
  };

export default chargeSlice.reducer;

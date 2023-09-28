import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import {
  FieldValue,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import db from "@/firebase";
import { IOrder } from "@/app/models/Order";

interface OderState {
  orders: Partial<IOrder[]>;
  loading: boolean;
  error: any;
}

const initialState: OderState = {
  orders: [],
  loading: false,
  error: null,
};
export const addOrdersSync = createAsyncThunk(
  "orders/addOrdersSync",
  async (orderData: any) => {
    try {
      const orderRef = collection(db, "orders");
      const docRef = await addDoc(orderRef, orderData);
      const id = docRef.id;
      return { ...orderData, id };
    } catch (error) {
      throw error;
    }
  }
);

export const updateAsync = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, newStatus }: { orderId: string; newStatus: string }) => {
    try {
      const orderDocRef = doc(collection(db, "orders"), orderId);
      const updateData: { status: string; updatedDeliveredAt?: FieldValue } = {
        status: newStatus,
      };

      // Check if the new status is "delivered" and add updatedDeliveredAt with serverTimestamp if true
      if (newStatus === "delivered") {
        updateData.updatedDeliveredAt = serverTimestamp();
      }

      await setDoc(orderDocRef, updateData, { merge: true });

      return { id: orderId, status: newStatus };
    } catch (error) {
      throw error;
    }
  }
);

const orderslice: any = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setOrder: (state: any, action: PayloadAction<Partial<IOrder>>) => {
      state.orders = action.payload;
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
      .addCase(addOrdersSync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addOrdersSync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(addOrdersSync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoading, setOrder, setError } = orderslice.actions;

export const fetchOrders =
  (userId?: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      const ordersRef = collection(db, "orders");

      let queryRef: any = ordersRef;

      if (userId) {
        queryRef = query(ordersRef, where("userId", "==", userId));
      }

      const querySnapshot = await getDocs(queryRef);

      const orders: any = [];
      querySnapshot.forEach((doc) => {
        const ordersData = doc.data() as Partial<IOrder>;
        const id = doc.id;
        const orderWithId = { ...ordersData, id };
        orders.push(orderWithId);
      });

      dispatch(setOrder(orders));
    } catch (error) {
      dispatch(setError("An error occurred while fetching orders."));
    }
  };

export default orderslice.reducer;

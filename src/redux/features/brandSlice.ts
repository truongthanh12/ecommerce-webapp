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
  updateDoc,
  where,
} from "firebase/firestore";
import { IBrand } from "@/models/Brand";
import { ADMIN_ID } from "@/app/constant";

interface BrandState {
  brands: IBrand[];
  loading: boolean;
  error: any;
}

const initialState: BrandState = {
  brands: [],
  loading: false,
  error: null,
};

export const addBrandSync = createAsyncThunk(
  "brands/addBrandSync",
  async (brandData: any) => {
    try {
      const brandRef = collection(db, "brands");
      const docRef = await addDoc(brandRef, brandData);
      const id = docRef.id;
      return { ...brandData, id };
    } catch (error) {
      throw error;
    }
  }
);

export const deleteBrandAsync = createAsyncThunk(
  "brands/deleteBrandAsync",
  async ({ brandId }: { brandId: string }, { rejectWithValue }) => {
    try {
      const brandRef = doc(db, "brands", brandId);

      await deleteDoc(brandRef);

      return brandId;
    } catch (error) {
      return rejectWithValue("An error occurred while deleting the brand.");
    }
  }
);

export const updateBrandAsync = createAsyncThunk(
  "brands/updateBrandAsync",
  async (
    { id, updatedBrand }: { id: string; updatedBrand: any },
    { rejectWithValue }
  ) => {
    try {
      const brandRef = doc(db, "brands", id);
      await updateDoc(brandRef, updatedBrand);
      return { id, ...updatedBrand };
    } catch (error) {
      return rejectWithValue("An error occurred while updating the brand.");
    }
  }
);

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setBrands: (state, action: PayloadAction<IBrand[]>) => {
      state.brands = action.payload;
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
      .addCase(addBrandSync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBrandSync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.brands.push(action.payload);
      })
      .addCase(addBrandSync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBrandAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBrandAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = null;
        state.brands = state.brands.filter(
          (brand) => brand.id !== action.payload
        );
      })
      .addCase(deleteBrandAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBrandAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBrandAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBrandIndex = state.brands.findIndex(
          (brand) => brand.id === action.payload
        );
        if (updatedBrandIndex !== -1) {
          state.brands[updatedBrandIndex] = action.payload;
        }
      })
      .addCase(updateBrandAsync.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoading, setBrands, setError } = brandSlice.actions;

export const fetchBrands =
  (isFetchByUser?: boolean, userId?: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Update to use the new query and getDocs function
      const brandsRef = collection(db, "brands");

      let queryRef: any = brandsRef;

      if (userId !== ADMIN_ID) {
        if (isFetchByUser) {
          queryRef = query(brandsRef, where("published", "==", isFetchByUser));
        }
        if (userId) {
          queryRef = query(brandsRef, where("userId", "==", userId));
        }
      }

      const querySnapshot = await getDocs(queryRef);

      const brands: IBrand[] = [];
      querySnapshot.forEach((doc) => {
        const brandData = doc.data() as IBrand;
        const id = doc.id;
        const brandWithId = { ...brandData, id };
        brands.push(brandWithId);
      });

      dispatch(setBrands(brands));
    } catch (error) {
      dispatch(setError("An error occurred while fetching brands."));
    }
  };

export const brandDataForm = (data: Partial<IBrand>, userId: string) => {
  return {
    image: data.image || "",
    name: data.name || "",
    slug: data.name?.replace(/ +/g, "-")?.toLowerCase() || "",
    type: data.type || "",
    published: data.published || false,
    userId: userId,
  };
};

export default brandSlice.reducer;

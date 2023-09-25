import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, store } from "@/redux/store";
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
import { ICarouselCard } from "@/app/models/Brand";
import { ADMIN_ID } from "@/app/constant";

interface BannerState {
  banners: ICarouselCard[];
  loading: boolean;
  error: any;
}

const initialState: BannerState = {
  banners: [],
  loading: false,
  error: null,
};

export const addBannerAsync = createAsyncThunk(
  "banners/addBannerAsync",
  async (bannerData: any) => {
    try {
      const bannerRef = collection(db, "hero-banners");
      const docRef = await addDoc(bannerRef, bannerData);
      const id = docRef.id;
      return { ...bannerData, id };
    } catch (error) {
      throw error;
    }
  }
);

export const deleteBannerAsync = createAsyncThunk(
  "banners/deleteBannerAsync",
  async ({ bannerId }: { bannerId: string }, { rejectWithValue }) => {
    try {
      const bannerRef = doc(db, "hero-banners", bannerId);

      await deleteDoc(bannerRef);

      return bannerId;
    } catch (error) {
      return rejectWithValue("An error occurred while deleting the banner.");
    }
  }
);

export const updateBannerAsync = createAsyncThunk(
  "banners/updateBannerAsync",
  async (
    { id, updateBanner }: { id: string; updateBanner: any },
    { rejectWithValue }
  ) => {
    try {
      const bannerRef = doc(db, "hero-banners", id);
      await updateDoc(bannerRef, updateBanner);
      return { id, ...updateBanner };
    } catch (error) {
      return rejectWithValue("An error occurred while updating the banner.");
    }
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setBanners: (state, action: PayloadAction<ICarouselCard[]>) => {
      state.banners = action.payload;
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
      .addCase(addBannerAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBannerAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.banners.push(action.payload);
      })
      .addCase(addBannerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBannerAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBannerAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = null;
        state.banners = state.banners.filter(
          (brand) => brand.id !== action.payload
        );
      })
      .addCase(deleteBannerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBannerAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBannerAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBrandIndex = state.banners.findIndex(
          (brand) => brand.id === action.payload
        );
        if (updatedBrandIndex !== -1) {
          state.banners[updatedBrandIndex] = action.payload;
        }
      })
      .addCase(updateBannerAsync.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoading, setBanners, setError } = bannerSlice.actions;

export const fetchBanners =
  (isFetchByUser?: boolean, userId?: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Update to use the new query and getDocs function
      const bannersRef = collection(db, "hero-banners");
      let queryRef: any = bannersRef;

      if (userId !== ADMIN_ID) {
        if (isFetchByUser) {
          queryRef = query(bannersRef, where("published", "==", isFetchByUser));
        }
        if (userId) {
          queryRef = query(bannersRef, where("userId", "==", userId));
        }
      }

      const querySnapshot = await getDocs(queryRef);

      const banners: ICarouselCard[] = [];
      querySnapshot.forEach((doc) => {
        const bannersData = doc.data() as ICarouselCard;
        const id = doc.id; // Get the document ID
        const bannerWithId = { ...bannersData, id };
        banners.push(bannerWithId);
      });

      dispatch(setBanners(banners));
    } catch (error) {
      dispatch(setError("An error occurred while fetching banners."));
    }
  };

export const bannerDataForm = (
  data: Partial<ICarouselCard>,
  userId: string
) => {
  return {
    imgUrl: data.imgUrl || "",
    title: data.title || "",
    type: data.type || "",
    buttonText: data.buttonText || "",
    buttonLink: data.buttonLink || "",
    description: data.description || "",
    published: data.published || false,
    userId: userId,
  };
};

export default bannerSlice.reducer;

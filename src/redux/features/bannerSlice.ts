import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, store } from "@/redux/store";
import db from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ICarouselCard } from "@/app/models/Brand";

interface BannerState {
  banners: ICarouselCard[];
  loading: boolean;
  error: string | null;
}

const initialState: BannerState = {
  banners: [],
  loading: false,
  error: null,
};

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
});

export const { setLoading, setBanners, setError } = bannerSlice.actions;

export const fetchBanners = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    // Update to use the new query and getDocs function
    const bannersRef = collection(db, "hero-banners");
    const querySnapshot = await getDocs(bannersRef);

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

export default bannerSlice.reducer;

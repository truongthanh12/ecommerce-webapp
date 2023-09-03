import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "@/redux/store";
import db from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { INavigation } from "@/app/models/Navigation";

interface NavigationState {
  navigations: INavigation[];
  loading: boolean;
  error: string | null;
}

const initialState: NavigationState = {
  navigations: [],
  loading: false,
  error: null,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setNavgiation: (state, action: PayloadAction<INavigation[]>) => {
      state.navigations = action.payload;
      state.loading = false;
      state.error = null;
    },
    addNavigation: (state, action: PayloadAction<INavigation>) => {
      const navigationsRef = collection(db, "navigations");
      addDoc(navigationsRef, action.payload)
        .then((docRef) => {
          const id = docRef.id;

          const navigationWithId = { ...action.payload, id };
          state.navigations.push(navigationWithId);
        })
        .catch((error) => {
          state.error = "An error occurred while adding a new navigation.";
          throw error;
        });
    },
    deleteNavigation: (state, action: PayloadAction<string>) => {
      const navigationsRef = collection(db, "navigations");
      deleteDoc(doc(navigationsRef, action.payload))
        .then(() => {
          state.navigations = state.navigations.filter(
            (navigation) => navigation.id !== action.payload
          );
        })
        .catch((error) => {
          state.error = "An error occurred while deleting the navigation.";
          throw error;
        });
    },
    updateNavigation: (
      state,
      action: PayloadAction<{ id: string; updatedNavigation: any }>
    ) => {
      const navigationsRef = collection(db, "navigations");
      updateDoc(
        doc(navigationsRef, action.payload.id),
        action.payload.updatedNavigation
      )
        .then(() => {
          state.navigations = state.navigations.map((navigation) =>
            navigation.id === action.payload.id
              ? action.payload.updatedNavigation
              : navigation
          );
        })
        .catch((error) => {
          state.error = "An error occurred while updating the navigation.";
          throw error;
        });
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLoading, setNavgiation, setError } = navigationSlice.actions;

export const fetchNaviagtions = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    // Update to use the new query and getDocs function
    const navigationsRef = collection(db, "navigations");
    const querySnapshot = await getDocs(navigationsRef);

    const navigations: INavigation[] = [];
    querySnapshot.forEach((doc) => {
      const navigationData = doc.data() as INavigation;
      const id = doc.id; // Get the document ID
      const navigationWithId = { ...navigationData, id };
      navigations.push(navigationWithId);
    });

    dispatch(setNavgiation(navigations));
  } catch (error) {
    dispatch(setError("An error occurred while fetching naviagtions."));
  }
};

export default navigationSlice.reducer;

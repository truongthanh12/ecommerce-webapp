import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "@/redux/store";
import db from "@/firebase";
import { ICategory } from "@/app/models/Category";
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

interface CategoryState {
  categories: ICategory[];
  loading: boolean;
  error: any;
  parentCategories: any;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  parentCategories: [],
};

export const addCategoryAsync = createAsyncThunk(
  "categories/addCategoryAsync",
  async (categoryData: any) => {
    try {
      const categoryRef = collection(db, "categories");
      const docRef = await addDoc(categoryRef, categoryData);
      const id = docRef.id;
      return { ...categoryData, id };
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  "categories/deleteCategoryAsync",
  async ({ categoryId }: { categoryId: string }, { rejectWithValue }) => {
    try {
      const cactegoryRef = doc(db, "categories", categoryId);

      await deleteDoc(cactegoryRef);

      return categoryId;
    } catch (error) {
      return rejectWithValue("An error occurred while deleting the banner.");
    }
  }
);

export const updateCategoryAsync = createAsyncThunk(
  "categories/updateCategoryAsync",
  async (
    { id, updatedCategory }: { id: string; updatedCategory: any },
    { rejectWithValue }
  ) => {
    try {
      const categoryRef = doc(db, "categories", id);
      await updateDoc(categoryRef, updatedCategory);
      return { id, ...updatedCategory };
    } catch (error) {
      return rejectWithValue("An error occurred while updating the category.");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCategories: (state, action: PayloadAction<ICategory[]>) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },
    setParentCategories: (state, action: PayloadAction<any>) => {
      state.parentCategories = action.payload;
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
      .addCase(addCategoryAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCategoryAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        );
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategoryAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategoryIndex = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );
        if (updatedCategoryIndex !== -1) {
          state.categories[updatedCategoryIndex] = action.payload;
        }
      })
      .addCase(updateCategoryAsync.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoading, setCategories, setParentCategories, setError } =
  categorySlice.actions;

export const fetchParentCategories = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    // Update to use the new query and getDocs function
    const categoriesRef = collection(db, "parent-categories");
    const querySnapshot = await getDocs(categoriesRef);

    const categories: any[] = [];
    querySnapshot.forEach((doc) => {
      const categoryData = doc.data();
      categories.push(categoryData);
    });

    dispatch(setParentCategories(categories));
  } catch (error) {
    dispatch(setError("An error occurred while fetching categories."));
  }
};

export const fetchCategories =
  (isFetchByUser?: boolean) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      const rechargeRef = collection(db, "categories");

      let queryRef: any = rechargeRef;

      if (isFetchByUser) {
        queryRef = query(rechargeRef, where("published", "==", isFetchByUser));
      }

      const querySnapshot = await getDocs(queryRef);

      const categories: ICategory[] = [];
      querySnapshot.forEach((doc) => {
        const categoryData = doc.data() as ICategory;
        const id = doc.id;
        const categoryWithId = { ...categoryData, id };
        categories.push(categoryWithId);
      });

      dispatch(setCategories(categories));
    } catch (error) {
      dispatch(setError("An error occurred while fetching recharge."));
    }
  };

export const categoryDataForm = (data: Partial<ICategory>) => {
  return {
    description: "description",
    icon: data.icon,
    image: data.image || "",
    name: data.name || "",
    slug: data.name?.replace(/ +/g, "-")?.toLowerCase(),
    type: data.type || "",
    parent: data.parent || "",
    published: false,
  };
};

export default categorySlice.reducer;

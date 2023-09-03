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
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// Create an async thunk for adding a category
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

// Create an async thunk for deleting a category
export const deleteCategoryAsync = createAsyncThunk(
  "categories/deleteCategoryAsync",
  async (categoryId, { rejectWithValue }: any) => {
    try {
      // Construct a reference to the specific collection
      const categoriesRef = collection(db, "categories");

      // Create a query to filter documents by 'id' field
      const queryToDelete = query(categoriesRef, where("id", "==", categoryId));

      // Get the documents that match the query
      const querySnapshot = await getDocs(queryToDelete);

      // Iterate through the matching documents and delete them
      querySnapshot.forEach(async (docToDelete) => {
        try {
          const docRef = doc(db, "categories", docToDelete.id);
          await deleteDoc(docRef);
        } catch (error) {
          console.error("Error deleting document: ", error);
        }
      });

      return categoryId;
    } catch (error) {
      return rejectWithValue("An error occurred while deleting the category.");
    }
  }
);

// Create an async thunk for updating a category
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

export const { setLoading, setCategories, setError } = categorySlice.actions;

export const fetchCategories = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    // Update to use the new query and getDocs function
    const categoriesRef = collection(db, "categories");
    const querySnapshot = await getDocs(categoriesRef);

    const categories: ICategory[] = [];
    querySnapshot.forEach((doc) => {
      const categoryData = doc.data() as ICategory;
      const id = doc.id;
      const categoryWithId = { ...categoryData, id };
      categories.push(categoryWithId);
    });

    dispatch(setCategories(categories));
  } catch (error) {
    dispatch(setError("An error occurred while fetching categories."));
  }
};

export const categoryDataForm = (data: Partial<ICategory>) => {
  return {
    description: "description",
    icon: null,
    image: data.image,
    name: data.name,
    slug: data.name?.replace(/ +/g, "-")?.toLowerCase(),
    type: data.type,
  };
};

export default categorySlice.reducer;

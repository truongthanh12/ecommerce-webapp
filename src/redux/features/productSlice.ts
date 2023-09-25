import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "@/redux/store";
import db from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { IProducts } from "@/app/models/Product";
import { IUser } from "@/app/models/User";
import { formatToSlug } from "@/app/utils/lib";
import { ADMIN_ID } from "@/app/constant";

interface productstate {
  products: IProducts[];
  loading: boolean;
  error: any;
  currentPage: number;
  hasMorePages: boolean;
  totalProducts: number;
}

const initialState: productstate = {
  products: [],
  loading: false,
  error: {},
  currentPage: 1,
  hasMorePages: true,
  totalProducts: 0,
};

export const addProductSync = createAsyncThunk(
  "products/addProductSync",
  async (productData: any) => {
    try {
      const productRef = collection(db, "products");
      const docRef = await addDoc(productRef, productData);
      const id = docRef.id;
      return { ...productData, id };
    } catch (error) {
      throw error;
    }
  }
);

export const deleteProductAsync = createAsyncThunk(
  "products/deleteProductAsync",
  async ({ productId }: { productId: string }, { rejectWithValue }) => {
    try {
      const productRef = doc(db, "products", productId);

      await deleteDoc(productRef);

      return productId;
    } catch (error) {
      return rejectWithValue("An error occurred while deleting the product.");
    }
  }
);

export const updateProductAsync = createAsyncThunk(
  "products/updateProductAsync",
  async (
    { id, updatedProduct }: { id: string; updatedProduct: any },
    { rejectWithValue }
  ) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, updatedProduct);
      return { id, ...updatedProduct };
    } catch (error) {
      return rejectWithValue("An error occurred while updating the product.");
    }
  }
);

export const updateProductQuantities =
  (productIds: string[], quantityToSubtract: number[]) => async () => {
    try {
      const updatePromises = [];

      for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];
        const productRef = doc(db, "products", productId);

        const productSnapshot = await getDoc(productRef);
        const productData = productSnapshot.data();

        if (productData) {
          const newQuantity = productData.stock - quantityToSubtract[i];
          const updatePromise = updateDoc(productRef, {
            stock: newQuantity || 0,
          });
          updatePromises.push(updatePromise);
        }
      }

      await Promise.all(updatePromises);
    } catch (error) {
      throw error;
    }
  };

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProducts: (state, action: PayloadAction<IProducts[]>) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setTotalProducts: (state, action: PayloadAction<number>) => {
      state.totalProducts = action.payload;
    },
    setHasMorePages: (state, action: PayloadAction<boolean>) => {
      state.hasMorePages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProductSync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductSync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProductSync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProductAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = null;
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProductIndex = state.products.findIndex(
          (product) => product.id === action.payload
        );
        if (updatedProductIndex !== -1) {
          state.products[updatedProductIndex] = action.payload;
        }
      })
      .addCase(updateProductAsync.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setLoading,
  setProducts,
  setError,
  setTotalProducts,
  setHasMorePages,
} = productSlice.actions;

export const fetchProducts =
  (isFetchByUser?: boolean, userId?: string, page?: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setLoading(true));

      const productsState: any = getState();
      const { products }: any = productsState.products || {};
      if (products) {
        dispatch(setTotalProducts(products.length));
      }
      // Calculate the start and end points based on the page size
      const pageSize = 10; // Adjust as needed
      const startAt = ((page || 0) - 1) * pageSize;
      const endAt = startAt + pageSize;

      // Update to use the new query and getDocs function
      const productsRef = collection(db, "products");

      let queryRef: any = productsRef;

      if (userId !== ADMIN_ID) {
        if (isFetchByUser) {
          queryRef = query(
            productsRef,
            where("published", "==", isFetchByUser)
          );
        }
        if (userId) {
          queryRef = query(productsRef, where("userId", "==", userId));
        }
      }

      if (page) {
        if (startAt > 0) {
          // Apply startAt if not on the first page
          queryRef = queryRef.startAfter(startAt);
        }
        queryRef = queryRef.endAt(endAt);
      }

      const querySnapshot = await getDocs(queryRef);

      if (querySnapshot.docs.length < pageSize) {
        dispatch(setHasMorePages(false));
      }

      const productsList: IProducts[] = [];
      querySnapshot.forEach((doc) => {
        const productData = doc.data() as IProducts;
        const id = doc.id;
        const productWithId = { ...productData, id };
        productsList.push(productWithId);
      });

      dispatch(setProducts(productsList));
    } catch (error) {
      dispatch(setError("An error occurred while fetching products."));
    }
  };

export const productDataForm = (
  data: Partial<IProducts>,
  user: Partial<IUser>
) => {
  return {
    description: data.description || "",
    thumbnail: data.thumbnail || "",
    title: data.title || "",
    slug: formatToSlug(data.title || ""),
    type: data.type || "",
    categories: data.categories || [],
    published: data.published || false,
    price: data.price || 0,
    colors: data.colors || [],
    sizes: data.sizes || [],
    brands: data.brands || "",
    discount: data.discount || 0,
    images: data.images || [],
    indexOfImages: data.indexOfImages,
    shop: user,
    stock: data.stock || 0,
    createdAt: serverTimestamp(),
    userId: user.docId,
  };
};

export default productSlice.reducer;

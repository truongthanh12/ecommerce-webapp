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
import { IComments, IProducts } from "@/app/models/Product";
import { IUser } from "@/app/models/User";
import { formatToSlug } from "@/app/utils/lib";
import { ADMIN_ID } from "@/app/constant";
interface productstate {
  products: IProducts[];
  loading: boolean;
  error: any;
  currentPage: number;
  hasMorePages: boolean;
  comments: IComments[];
}

const initialState: productstate = {
  products: [],
  loading: false,
  comments: [],
  error: {},
  currentPage: 1,
  hasMorePages: true,
};

// comment actions
export const addCommentAsync = createAsyncThunk(
  "products/addCommentAsync",
  async ({
    productId,
    comment,
    rating,
    user,
  }: {
    productId: string;
    comment: string;
    rating: number;
    user: Partial<IUser>;
  }) => {
    try {
      const productRef = doc(collection(db, "products"), productId);

      const commentData = {
        comment,
        rating,
        createdAt: serverTimestamp(),
        user,
      };

      // Use Firestore's auto-generated document ID for the comment
      const commentRef = await addDoc(
        collection(productRef, "comments"),
        commentData
      );

      // Update the comment data with the generated document ID
      const commentWithId = {
        id: commentRef.id,
        ...commentData,
      };

      return commentWithId;
    } catch (error) {
      throw error;
    }
  }
);

export const getCommentsByProductId = async (productId: string) => {
  try {
    const productRef = doc(db, "products", productId);

    const commentsRef = collection(productRef, "comments");

    const querySnapshot = await getDocs(commentsRef);

    const comments: any[] = [];

    querySnapshot.forEach((doc) => {
      const commentData = doc.data();
      comments.unshift(commentData);
    });

    // Return the array of comments
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export async function deleteComment(productId: string, commentId: string) {
  try {
    const productRef = doc(db, "products", productId);
    const commentsRef = collection(productRef, "comments");

    const commentDocRef = doc(commentsRef, commentId);

    await deleteDoc(commentDocRef);

    return true;
  } catch (error) {
    throw error;
  }
}
export async function getProductsWithComments() {
  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);

    const productsWithComments = [];

    for (const doc of querySnapshot.docs) {
      const productData = doc.data();
      const productId = doc.id;
      const commentsRef = collection(doc.ref, "comments");
      const commentsSnapshot = await getDocs(commentsRef);

      if (!commentsSnapshot.empty) {
        const comments = commentsSnapshot.docs.map((commentDoc) =>
          commentDoc.data()
        );

        productsWithComments.push({
          id: productId,
          ...productData,
          comments: comments,
        });
      }
    }

    return productsWithComments;
  } catch (error) {
    console.error("Error fetching products with comments:", error);
    throw error;
  }
}

// products actions
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

const productSlice: any = createSlice({
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
      })

      // comments
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        const newComment: any = action.payload;
        const productIndex = state.products.findIndex(
          (product) => product.id === newComment.productId
        );

        if (productIndex !== -1) {
          const updatedComments = [
            ...state.products[productIndex].comments,
            newComment,
          ];

          // Update the product's comments array
          state.products[productIndex].comments = updatedComments;
        }
      });
  },
});

export const { setLoading, setProducts, setError, setHasMorePages } =
  productSlice.actions;

export const fetchProducts =
  ({ isFetchByUser, userId }: { isFetchByUser?: boolean; userId?: string }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setLoading(true));

      let queryRef: any = collection(db, "products");

      if (userId !== ADMIN_ID) {
        if (isFetchByUser) {
          queryRef = query(queryRef, where("published", "==", isFetchByUser));
        }
        if (userId) {
          queryRef = query(queryRef, where("userId", "==", userId));
        }
      }

      const querySnapshot = await getDocs(queryRef);

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
    tags: data.tags || [],
  };
};

export default productSlice.reducer;

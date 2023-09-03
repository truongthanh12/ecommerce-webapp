import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
import { IProducts } from "@/app/models/Product";

interface productstate {
  products: IProducts[];
  loading: boolean;
  error: string | null;
}

const initialState: productstate = {
  products: [],
  loading: false,
  error: null,
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
    addProduct: (state, action: PayloadAction<IProducts>) => {
      const productsRef = collection(db, "products");
      addDoc(productsRef, action.payload)
        .then((docRef) => {
          const id = docRef.id;

          const productWithId = { ...action.payload, id };
          state.products.push(productWithId);
        })
        .catch((error) => {
          state.error = "An error occurred while adding a new product.";
          throw error;
        });
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      const productsRef = collection(db, "products");
      deleteDoc(doc(productsRef, action.payload))
        .then(() => {
          state.products = state.products.filter(
            (product) => product.id !== action.payload
          );
        })
        .catch((error) => {
          state.error = "An error occurred while deleting the product.";
          throw error;
        });
    },
    updateProduct: (
      state,
      action: PayloadAction<{ id: string; updatedProduct: any }>
    ) => {
      const productsRef = collection(db, "products");
      updateDoc(
        doc(productsRef, action.payload.id),
        action.payload.updatedProduct
      )
        .then(() => {
          state.products = state.products.map((product) =>
            product.id === action.payload.id
              ? action.payload.updatedProduct
              : product
          );
        })
        .catch((error) => {
          state.error = "An error occurred while updating the product.";
          throw error;
        });
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLoading, setProducts, setError } = productSlice.actions;

export const fetchProducts = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    // Update to use the new query and getDocs function
    const productsRef = collection(db, "products");
    const queryPublishProduct = query(
      productsRef,
      where("publish", "==", true)
    );
    const querySnapshot = await getDocs(queryPublishProduct);

    const products: IProducts[] = [];
    querySnapshot.forEach((doc) => {
      const productData = doc.data() as IProducts;
      const id = doc.id;
      const productWithId = { ...productData, id };
      products.push(productWithId);
    });

    dispatch(setProducts(products));
  } catch (error) {
    dispatch(setError("An error occurred while fetching products."));
  }
};

export default productSlice.reducer;

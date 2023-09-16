import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import authSlice from "./features/authSlice";
import messageSlice from "./features/messageSlice";
import categorySlice from "./features/categorySlice";
import navigationSlice from "./features/navigationSlice";
import bannerSlice from "./features/bannerSlice";
import productSlice from "./features/productSlice";
import brandSlice from "./features/brandSlice";
import adminSlice from "./features/adminSlice";
import cartSlice from "./features/cartSlice";
import wishlistSlice from "./features/wishlistSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["isLoading"],
};
const cartsPersistConfig = {
  key: "carts",
  storage,
};

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
  whiteList: ["auth", "carts"],
};

const rootReducer: any = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  message: messageSlice,
  categories: categorySlice,
  navigations: navigationSlice,
  banners: bannerSlice,
  products: productSlice,
  brands: brandSlice,
  statusAdmin: adminSlice,
  carts: persistReducer(cartsPersistConfig, cartSlice),
  wishlist: wishlistSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notesReducer from "./slices/notesSlice";
import authReducer from "./slices/authSlice";

// Persist config
const persistConfig = {
  key: "root",
  storage: AsyncStorage, // Use AsyncStorage for React Native
};

// Combine reducers
const rootReducer = combineReducers({
  notes: notesReducer,
  auth: authReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist uses non-serializable values, so we need to disable this check
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Imports
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import {AppThunk} from '../store'; // Ensure this path matches where you configure your Redux store

interface UserState {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}

interface AuthState {
  user: UserState | null;
  loading: boolean;
  error: string | null;
}
// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set the user in the state
    setUser: (state, action: PayloadAction<UserState | null>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Set loading state before starting an async operation
    setLoginPending: state => {
      state.loading = true;
      state.error = null;
    },
    // Set error on login failure
    setLoginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Handle user logout
    logout: state => {
      state.user = null;
      state.loading = false;
      state.error = null;
      auth().signOut(); // Make sure to sign out from Firebase as well
    },
  },
});

// Export actions
export const {setUser, logout, setLoginPending, setLoginFailure} =
  authSlice.actions;

// Thunk for handling login
export const login =
  (email: string, password: string): AppThunk =>
  async dispatch => {
    dispatch(setLoginPending());
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      dispatch(
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          emailVerified: userCredential.user.emailVerified,
        }),
      );
    } catch (error) {
      if (typeof error === 'string') {
        dispatch(setLoginFailure(error));
      } else if (error instanceof Error) {
        dispatch(setLoginFailure(error.message)); // Using Error object's message property
      } else {
        dispatch(setLoginFailure('An unknown error occurred'));
      }
    }
  };

// Thunk for handling signup
export const signup =
  (email: string, password: string): AppThunk =>
  async dispatch => {
    dispatch(setLoginPending()); // Reuse the loading state action
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      console.log('User account created & signed in!');
      dispatch(
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          emailVerified: userCredential.user.emailVerified,
        }),
      );
    } catch (error) {
      if (typeof error === 'string') {
        dispatch(setLoginFailure(error));
      } else if (error instanceof Error) {
        dispatch(setLoginFailure(error.message)); // Using Error object's message property
      } else {
        dispatch(setLoginFailure('An unknown error occurred during signup'));
      }
    }
  };

// Export reducer
export default authSlice.reducer;

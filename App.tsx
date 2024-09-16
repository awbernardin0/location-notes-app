import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { persistor, store } from "./redux/store";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import MainScreen from "./screens/MainScreen";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import NoteScreen from "./screens/NoteScreen";
import { Note } from "./redux/slices/notesSlice";

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  Note: { note: Note } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(
    null
  );

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setCurrentUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={"Login"}>
              {currentUser ? (
                <>
                  <Stack.Screen name="Main" component={MainScreen} />
                  <Stack.Screen name="Note" component={NoteScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Signup" component={SignupScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

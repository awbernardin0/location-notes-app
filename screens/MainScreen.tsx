import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Button, FAB } from "react-native-paper";
import NotesListScreen from "./NotesListScreen";
import NotesMapScreen from "./NotesMapScreen";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  NoteList: undefined;
  NoteMap: undefined;
  Note: undefined;
};

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: MainScreenNavigationProp;
};

const Tab = createBottomTabNavigator();

const MainScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Additional icons can be added here */}
          <Button onPress={() => dispatch(logout())}>Logout</Button>
        </View>
      ),
    });
  }, [navigation, dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user?.email ?? "Guest"}</Text>

      <Tab.Navigator>
        <Tab.Screen
          name="NoteList"
          component={NotesListScreen}
          options={{ title: "List Mode", headerShown: false }}
        />
        <Tab.Screen
          name="NoteMap"
          component={NotesMapScreen}
          options={{ title: "Map Mode", headerShown: false }}
        />
      </Tab.Navigator>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("Note")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  welcomeText: {
    fontSize: 20,
    marginVertical: 20,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 60,
    backgroundColor: "skyblue",
  },
});

export default MainScreen;

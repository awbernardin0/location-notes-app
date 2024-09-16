import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchNotes, Note } from "../redux/slices/notesSlice";
import { useDispatch } from "../src/hooks";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";

// Define the navigation prop type
type NotesListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Note"
>;

const NotesListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NotesListScreenNavigationProp>();
  const notes = useSelector((state: RootState) => state.notes.notes);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  // Navigate to NoteScreen with the selected note
  const handlePressNote = (note: Note) => {
    navigation.navigate("Note", { note });
  };

  // Render empty content message if there are no notes
  const renderEmptyContainer = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No notes available. Start adding some!
      </Text>
    </View>
  );

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.noteItem}
          onPress={() => handlePressNote(item)}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text>{new Date(item.date).toLocaleDateString()}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={renderEmptyContainer}
    />
  );
};

const styles = StyleSheet.create({
  noteItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50, // Adjust this value as needed
  },
  emptyText: {
    fontSize: 16,
    color: "#666", // A subtle text color for empty state
  },
});

export default NotesListScreen;

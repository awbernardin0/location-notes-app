import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import {
  addNoteAndSave,
  updateNoteAndSave,
  deleteNoteAndSave,
  Note,
} from "../redux/slices/notesSlice";
import Geolocation from "react-native-geolocation-service";
import { useDispatch } from "../src/hooks";
import { RootStackParamList } from "../App";

const NoteScreen: React.FC<StackScreenProps<RootStackParamList, "Note">> = ({
  route,
  navigation,
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState<Note["location"] | null>(null);
  const dispatch = useDispatch();

  const { note } = route.params || {};

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBody(note.body);
      setDate(new Date(note.date));
      setLocation(note.location);
    } else {
      fetchAndSetLocation();
    }
  }, []);

  const fetchAndSetLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error);
        Alert.alert(
          "Location Error",
          "Unable to fetch location. Using default."
        );
        setLocation({ latitude: 11.64365, longitude: 78.14502 }); // Default location
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleSave = () => {
    if (!location) return; // Ensure location is set before proceeding

    const newNote: Note = {
      id: note ? note.id : Date.now().toString(),
      title,
      body,
      date: date.toISOString(),
      location: location,
    };

    if (note) {
      dispatch(updateNoteAndSave(newNote)); // Updates note and persists state
    } else {
      dispatch(addNoteAndSave(newNote)); // Adds note and persists state
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    if (note) {
      dispatch(deleteNoteAndSave(note.id));
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Note Title"
      />
      <TextInput
        style={styles.input}
        value={body}
        onChangeText={setBody}
        placeholder="Note Body"
        multiline
      />
      <Button title="Save Note" onPress={handleSave} />
      {note && (
        <Button title="Delete Note" onPress={handleDelete} color="red" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    marginTop: 16,
    marginBottom: 10,
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
});

export default NoteScreen;

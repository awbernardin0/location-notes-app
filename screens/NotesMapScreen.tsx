import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchNotes } from "../redux/slices/notesSlice";
import { useDispatch } from "../src/hooks"; // Make sure the import path for useDispatch is correct.

const NotesMapScreen: React.FC = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state: RootState) => state.notes.notes);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825, // Example latitude for initial region
          longitude: -122.4324, // Example longitude for initial region
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {notes.length > 0 ? (
          notes.map((note) => (
            <Marker
              key={note.id}
              coordinate={{
                latitude: note.location.latitude,
                longitude: note.location.longitude,
              }}
              title={note.title}
              description={note.body}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No notes available on the map. Add some!
            </Text>
          </View>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  emptyContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -50 }],
    width: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

export default NotesMapScreen;

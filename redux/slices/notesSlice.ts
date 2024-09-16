import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch, RootState } from "../store"; // Ensure RootState is correctly imported

export interface Note {
  id: string;
  title: string;
  body: string;
  date: string;
  location: { latitude: number; longitude: number };
}

interface NotesState {
  notes: Note[];
}

const initialState: NotesState = {
  notes: [],
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      // Sort notes in descending order by date (most recent on top)
      state.notes = action.payload.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
      // Sort notes in descending order by date (most recent on top)
      state.notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex((note) => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
      // Sort notes in descending order by date (most recent on top)
      state.notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
      // Sort notes in descending order by date (most recent on top)
      state.notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
  },
});

export const { setNotes, addNote, updateNote, deleteNote } = notesSlice.actions;

// Save notes to AsyncStorage
export const saveNotes =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const notes = getState().notes.notes; // Get the current state of notes
      const notesString = JSON.stringify(notes);
      await AsyncStorage.setItem("notes", notesString);
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  };

// Fetch notes from AsyncStorage
export const fetchNotes = () => async (dispatch: AppDispatch) => {
  try {
    const notesString = await AsyncStorage.getItem("notes");
    const notes: Note[] = notesString ? JSON.parse(notesString) : [];
    dispatch(setNotes(notes));
  } catch (error) {
    console.error("Failed to fetch notes:", error);
  }
};

// Thunks for adding, updating, and deleting notes with persistence
export const addNoteAndSave = (note: Note) => async (dispatch: AppDispatch) => {
  dispatch(addNote(note));
  await dispatch(saveNotes()); // Persist notes after adding
};

export const updateNoteAndSave =
  (note: Note) => async (dispatch: AppDispatch) => {
    dispatch(updateNote(note));
    await dispatch(saveNotes()); // Persist notes after updating
  };

export const deleteNoteAndSave =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(deleteNote(id));
    await dispatch(saveNotes()); // Persist notes after deleting
  };

export default notesSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import { AppDispatch } from '../store';

interface Note {
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
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
  },
});

export const { setNotes } = notesSlice.actions;

export const fetchNotes = () => async (dispatch: AppDispatch) => {
  const notesSnapshot = await firestore().collection('notes').get();
  const notes = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Note[];
  dispatch(setNotes(notes));
};

export default notesSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HashMap } from 'types/utils';
import { definitions } from 'types/swagger';
import { NotesAPI } from 'api';

type Note = definitions['Note'];

const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async ({
    cursor,
    limit = 10,
    labelId,
  }: {
    cursor?: string;
    limit?: number;
    labelId?: string;
  }) => await NotesAPI.getNotes({ query: { cursor, limit, labelId } })
);

const createNote = createAsyncThunk(
  'notes/createNote',
  async (note: Note) => await NotesAPI.createNote({ body: { data: note } })
);

const modifyNote = createAsyncThunk(
  'notes/modifyNote',
  async ({ noteId, note }: { noteId: string; note: Note }) =>
    await NotesAPI.modifyNote({ path: { noteId }, body: { data: note } })
);

type NoteState = {
  notesById: HashMap<Note>;
  noteList: {
    data: string[];
    cursor?: string;
    hasMore: boolean;
  };
};

// Define the initial state using that type
const initialState: NoteState = {
  notesById: {},
  noteList: { data: [], hasMore: true },
};

export const slice = createSlice({
  name: 'notes',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotes.fulfilled, (state, action) => {
      const { data = [], cursor, hasMore = false } = action.payload;
      data.forEach((note) => {
        state.notesById[note.id as string] = note;
      });
      state.noteList.data.push(...data.map(({ id }) => id as string));
      state.noteList = { ...state.noteList, cursor, hasMore };
    });

    builder.addCase(createNote.fulfilled, (state, action) => {
      const newNote = action.payload;
      const noteId = newNote.id as string;
      state.notesById[noteId] = newNote;
      state.noteList.data.unshift(noteId);
    });

    builder.addCase(modifyNote.fulfilled, (state, action) => {
      const newNote = action.payload;
      const noteId = newNote.id as string;
      state.notesById[noteId] = newNote;
    });
  },
});

export const actions = { ...slice.actions, fetchNotes, createNote, modifyNote };

export default slice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { HashMap } from 'types/utils';
import { definitions } from 'types/swagger';
import { NotesAPI } from 'api';
import { RootState } from '../store';

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

const createAndInsertNote = createAsyncThunk(
  'notes/createAndInsertNote',
  async (note: Note, thunkAPI) =>
    thunkAPI
      .dispatch(createNote(note))
      .unwrap()
      .then((note) => thunkAPI.dispatch(slice.actions.insertNote(note)))
);

const insertIfNotEmpty = createAsyncThunk(
  'notes/insertIfNotEmpty',
  async (noteId: string, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const note = state.notes.notesById[noteId];
    if (!note.empty) thunkAPI.dispatch(slice.actions.insertNote(note));
  }
);

const modifyNote = createAsyncThunk(
  'notes/modifyNote',
  async ({ noteId, note }: { noteId: string; note: Note }) =>
    await NotesAPI.modifyNote({ path: { noteId }, body: { data: note } })
);

const modifyAndInvalidateNote = createAsyncThunk(
  'notes/modifyNoteAndRefetch',
  async (params: { noteId: string; note: Note }, thunkAPI) =>
    thunkAPI
      .dispatch(modifyNote(params))
      .unwrap()
      .then((note) => thunkAPI.dispatch(slice.actions.invalidateNote(note)))
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
    insertNote: (state, action: PayloadAction<Note>) => {
      const { id: noteId } = action.payload;
      state.noteList.data.unshift(noteId as string);
    },
    invalidateNote: (state, action: PayloadAction<Note>) => {
      const { id: idToRemove } = action.payload;
      state.noteList.data = state.noteList.data.filter(
        (id) => id !== idToRemove
      );
    },
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
    });

    builder.addCase(modifyNote.fulfilled, (state, action) => {
      const newNote = action.payload;
      const noteId = newNote.id as string;
      state.notesById[noteId] = newNote;
    });
  },
});

export const actions = {
  ...slice.actions,
  fetchNotes,
  createNote,
  createAndInsertNote,
  modifyNote,
  modifyAndInvalidateNote,
  insertIfNotEmpty,
};

export default slice.reducer;

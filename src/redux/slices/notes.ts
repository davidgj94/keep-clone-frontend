import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import config from 'config';
import { HashMap } from 'types/utils';
import { definitions } from 'types/swagger';
import { NotesAPI } from 'api';
import { RootState } from '../store';

type Note = definitions['Note'];

const setQueryAndRefetch = createAsyncThunk(
  'notes/setQueryAndRefecth',
  async (
    { labelId, archived }: { labelId?: string; archived?: boolean },
    thunkAPI
  ) => {
    const query = labelId ? { labelId } : archived ? { archived } : undefined;
    thunkAPI.dispatch(slice.actions.reset());
    thunkAPI.dispatch(slice.actions.setQuery(query));
    thunkAPI.dispatch(fetchNotes());
  }
);

const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (_: void, thunkAPI) => {
    const {
      notes: {
        noteList: { cursor, currentRequestId, hasMore, query },
      },
    } = thunkAPI.getState() as RootState;
    if (currentRequestId !== thunkAPI.requestId || !hasMore) return;

    return await NotesAPI.getNotes({
      query: { cursor, limit: config.LIMIT, ...query },
    });
  }
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
  'notes/modifyAndInvalidateNote',
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
    query?: { labelId: string } | { archived: true };
    currentRequestId?: string;
  };
  selectedNotes: string[];
};

export const isLabelQuery = (
  query: NonNullable<NoteState['noteList']['query']>
): boolean => !!(query as { labelId: string }).labelId;

// Define the initial state using that type
const initialState: NoteState = {
  notesById: {},
  noteList: { data: [], hasMore: true, currentRequestId: undefined },
  selectedNotes: [],
};

export const slice = createSlice({
  name: 'notes',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => initialState,
    setQuery: (
      state,
      action: PayloadAction<NoteState['noteList']['query']>
    ) => {
      state.noteList.query = action.payload;
    },
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
    insertSelected: (state, action: PayloadAction<string>) => {
      const noteIdToInsert = action.payload;
      state.selectedNotes.push(noteIdToInsert);
    },
    removeSelected: (state, action: PayloadAction<string>) => {
      const noteIdToRemove = action.payload;
      state.selectedNotes = state.selectedNotes.filter(
        (noteId) => noteId != noteIdToRemove
      );
    },
    resetSelected: (state) => {
      state.selectedNotes = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotes.pending, (state, action) => {
      if (!state.noteList.currentRequestId)
        state.noteList.currentRequestId = action.meta.requestId;
    });
    builder.addCase(fetchNotes.rejected, (state, action) => {
      state.noteList.currentRequestId = undefined;
    });
    builder.addCase(fetchNotes.fulfilled, (state, action) => {
      if (!action.payload) return;
      const { data = [], cursor, hasMore = false } = action.payload;
      data.forEach((note) => {
        state.notesById[note.id as string] = note;
      });
      state.noteList.data.push(...data.map(({ id }) => id as string));
      state.noteList = { ...state.noteList, cursor, hasMore };
      state.noteList.currentRequestId = undefined;
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
  setQueryAndRefetch,
};

export default slice.reducer;

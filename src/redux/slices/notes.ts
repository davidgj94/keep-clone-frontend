import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../store';
import { HashMap } from '../../types/utils';
import { definitions } from '../../types/swagger';
import * as API from '../../api';

const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  // if you type your function argument here
  async ({
    cursor,
    limit = 10,
    labelId,
  }: Parameters<typeof API.getNotes>[0]['query']) =>
    await API.getNotes({ query: { cursor, limit, labelId } })
);

type NoteState = {
  notesById: HashMap<definitions['Note']>;
  noteListState: {
    data: string[];
    cursor?: string;
    hasMore: boolean;
  };
};

// Define the initial state using that type
const initialState: NoteState = {
  notesById: {},
  noteListState: { data: [], hasMore: true },
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
      state.noteListState.data.push(...data.map(({ id }) => id as string));
      state.noteListState = { ...state.noteListState, cursor, hasMore };
    });
  },
});

export const actions = { ...slice.actions, fetchNotes };

export default slice.reducer;

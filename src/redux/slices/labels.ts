import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../store';
import { HashMap } from '../../types/utils';
import { definitions } from '../../types/swagger';
import * as API from '../../api';

const fetchLabels = createAsyncThunk(
  'labels/fetchLabels',
  // if you type your function argument here
  async () => await API.getLabels()
);

type LabelState = {
  labelsById: HashMap<definitions['Label']>;
};

// Define the initial state using that type
const initialState: LabelState = {
  labelsById: {},
};

export const slice = createSlice({
  name: 'labels',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLabels.fulfilled, (state, action) => {
      const { data } = action.payload;
      if (data) {
        state.labelsById = data.reduce((acc, val) => {
          acc[val.id as string] = val;
          return acc;
        }, {} as typeof state.labelsById);
      }
    });
  },
});

export const actions = { ...slice.actions, fetchLabels };

export default slice.reducer;

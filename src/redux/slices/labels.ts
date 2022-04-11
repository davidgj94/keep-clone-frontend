import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HashMap } from 'types/utils';
import { definitions } from 'types/swagger';
import { LabelsAPI } from 'api';
import { Label } from '@mui/icons-material';
import { omit } from 'lodash';

type Label = definitions['Label'];

const fetchLabels = createAsyncThunk(
  'labels/fetchLabels',
  async () => await LabelsAPI.getLabels()
);

const createLabel = createAsyncThunk(
  'labels/createLabel',
  async (name: string) =>
    await LabelsAPI.createLabel({ body: { data: { name } } })
);

const modifyLabel = createAsyncThunk(
  'labels/modifyLabel',
  async ({ labelId, label }: { labelId: string; label: Label }) =>
    await LabelsAPI.modifyLabel({ path: { labelId }, body: { data: label } })
);

const deleteLabel = createAsyncThunk(
  'labels/deleteLabel',
  async (labelId: string) => await LabelsAPI.deleteLabel({ path: { labelId } })
);

type LabelState = {
  labelsById: HashMap<definitions['Label']>;
  labelsList: string[];
};

// Define the initial state using that type
const initialState: LabelState = {
  labelsById: {},
  labelsList: [],
};

export const slice = createSlice({
  name: 'labels',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLabels.fulfilled, (state, action) => {
      const { data } = action.payload;
      if (data) {
        state.labelsById = data.reduce((acc, val) => {
          acc[val.id as string] = val;
          return acc;
        }, {} as typeof state.labelsById);
        state.labelsList = data.map(({ id }) => id as string);
      }
    });

    builder.addCase(createLabel.fulfilled, (state, action) => {
      const newLabel = action.payload;
      const labelId = newLabel.id as string;
      state.labelsById[labelId] = newLabel;
      state.labelsList.unshift(labelId);
    });

    builder.addCase(modifyLabel.fulfilled, (state, action) => {
      const newLabel = action.payload;
      const labelId = newLabel.id as string;
      state.labelsById[labelId] = newLabel;
    });

    builder.addCase(deleteLabel.fulfilled, (state, action) => {
      const { id: labelIdToRemove } = action.payload;
      state.labelsById = omit(state.labelsById, [labelIdToRemove as string]);
      state.labelsList = state.labelsList.filter(
        (labelId) => labelId !== labelIdToRemove
      );
    });
  },
});

export const actions = {
  ...slice.actions,
  fetchLabels,
  createLabel,
  modifyLabel,
  deleteLabel,
};

export default slice.reducer;

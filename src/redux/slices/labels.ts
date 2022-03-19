import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HashMap } from 'types/utils';
import { definitions } from 'types/swagger';
import { LabelsAPI } from 'api';
import { Label } from '@mui/icons-material';

type Label = definitions['Label'];

const fetchLabels = createAsyncThunk(
  'labels/fetchLabels',
  async () => await LabelsAPI.getLabels()
);

const createLabel = createAsyncThunk(
  'labels/createLabel',
  async (label: Label) => await LabelsAPI.createLabel({ body: { data: label } })
);

const modifyLabel = createAsyncThunk(
  'labels/modifyLabel',
  async ({ labelId, label }: { labelId: string; label: Label }) =>
    await LabelsAPI.modifyLabel({ path: { labelId }, body: { data: label } })
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
  },
});

export const actions = {
  ...slice.actions,
  fetchLabels,
  createLabel,
  modifyLabel,
};

export default slice.reducer;

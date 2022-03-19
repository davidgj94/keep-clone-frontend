import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { useAppSelector, useAppDispatch } from 'hooks';
import { definitions } from 'types/swagger';
import { noteActions } from '#redux/slices';

interface NoteLabelProps {
  noteId: string;
  labelsIds: string[];
}

const NoteLabels = ({ noteId, labelsIds }: NoteLabelProps) => {
  const dispatch = useAppDispatch();
  const labels = useAppSelector((state) =>
    labelsIds.map((labelId) => state.labels.labelsById[labelId])
  );
  const onDeleteFactory = (label: definitions['Label']) => () =>
    dispatch(
      noteActions.modifyNote({
        noteId,
        note: {
          labels: labelsIds.filter((labelId) => labelId !== label.id),
        },
      })
    );
  return (
    <Stack direction="row" spacing={1}>
      {labels.map((label) => (
        <Chip
          key={label.id}
          label={label.name}
          onDelete={onDeleteFactory(label)}
          onClick={(e) => e.stopPropagation()}
        />
      ))}
    </Stack>
  );
};

export default NoteLabels;

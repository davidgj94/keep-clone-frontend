import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { useAppSelector } from 'hooks';

interface NoteLabelProps {
  labelIds: string[];
}

const NoteLabels = ({ labelIds }: NoteLabelProps) => {
  const labels = useAppSelector((state) =>
    labelIds.map((labelId) => state.labels.labelsById[labelId])
  );
  return (
    <Stack direction="row" spacing={1}>
      {labels.map((label) => (
        <Chip
          key={label.id}
          label={label.name}
          onDelete={() => ''}
          onClick={(e) => e.stopPropagation()}
        />
      ))}
    </Stack>
  );
};

export default NoteLabels;

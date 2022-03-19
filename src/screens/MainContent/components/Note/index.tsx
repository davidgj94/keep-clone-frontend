import React, { useState } from 'react';

import AddAlertIcon from '@mui/icons-material/AddAlert';
import ArchiveIcon from '@mui/icons-material/Archive';
import ImageIcon from '@mui/icons-material/Image';
import PaletteIcon from '@mui/icons-material/Palette';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { CSSObject, styled, SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useAppSelector, useAppDispatch } from 'hooks';
import MoreButton from './MoreButton';
import NoteLabels from './NoteLabels';

interface NoteBoxProps {
  isFocused?: boolean;
  editMode?: boolean;
}

const NoteBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFocused' && prop !== 'editMode',
})<NoteBoxProps>(({ theme, isFocused, editMode }) => ({
  width: '400px',
  boxSizing: 'border-box',
  border: '1px solid #000',
  boxShadow: 'none',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  ...(!editMode
    ? ({
        '.options': { visibility: 'hidden' },
        ':hover': { boxShadow: theme.shadows[10] },
        ':hover .options': { visibility: 'visible' },
        ...(isFocused ? { '.options': { visibility: 'inherit' } } : {}),
      } as CSSObject)
    : {}),
}));

interface NoteProps {
  noteId: string;
  customStyles?: SxProps<Theme>;
  onClick?: () => void;
  onOptionsClick?: () => void;
  isFocused?: boolean;
  editMode?: boolean;
}

const Note = ({
  noteId,
  customStyles,
  onClick,
  onOptionsClick,
  isFocused = false,
  editMode = false,
}: NoteProps) => {
  const note = useAppSelector((state) => state.notes.notesById[noteId]);
  return (
    <NoteBox
      component="div"
      tabIndex={0}
      sx={customStyles}
      onClick={() => onClick && onClick()}
      isFocused={isFocused}
      editMode={editMode}
    >
      <Typography variant="h6" component="h2">
        {note.title}
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        {note?.content}
      </Typography>
      <NoteLabels labelIds={note.labels as string[]} />
      <Stack
        direction="row"
        spacing={1}
        className="options"
        onClick={(e) => {
          if (onOptionsClick) {
            onOptionsClick();
            e.stopPropagation();
          }
        }}
      >
        <IconButton size="small" color="inherit">
          <AddAlertIcon />
        </IconButton>
        <IconButton size="small" color="inherit">
          <PersonAddAlt1Icon />
        </IconButton>
        <IconButton size="small" color="inherit">
          <PaletteIcon />
        </IconButton>
        <IconButton size="small" color="inherit">
          <ImageIcon />
        </IconButton>
        <IconButton size="small" color="inherit">
          <ArchiveIcon />
        </IconButton>
        <MoreButton allowOpenPopover={isFocused} />
      </Stack>
    </NoteBox>
  );
};

export default Note;

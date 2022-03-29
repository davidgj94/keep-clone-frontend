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
import TextField from '@mui/material/TextField';

import { useAppSelector, useAppDispatch } from 'hooks';
import Options from './Options';
import NoteLabels from './NoteLabels';
import NoteTextField from './NoteTextField';

interface NoteBoxProps {
  isFocused?: boolean;
  mode: 'display' | 'edit' | 'select';
}

const NoteBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFocused' && prop !== 'editMode',
})<NoteBoxProps>(({ theme, isFocused, mode }) => ({
  width: '400px',
  boxSizing: 'border-box',
  border: '1px solid #000',
  boxShadow: 'none',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  ...(mode == 'display'
    ? {
        '.options': { visibility: 'hidden' },
        ':hover': { boxShadow: theme.shadows[10] },
        ':hover .options': { visibility: 'visible' },
        ...(isFocused ? { '.options': { visibility: 'inherit' } } : {}),
      }
    : {}),
  ...(mode == 'select'
    ? {
        '.options': {
          visibility: 'hidden',
        },
        ...(isFocused ? { border: '2px solid #000' } : {}),
      }
    : {}),
}));

interface NoteProps {
  noteId: string;
  customStyles?: SxProps<Theme>;
  onClick?: () => void;
  onOptionsClick?: () => void;
  isFocused?: boolean;
  mode: 'display' | 'edit' | 'select';
}

const Note = ({
  noteId,
  customStyles,
  onClick,
  onOptionsClick,
  isFocused = false,
  mode = 'display',
}: NoteProps) => {
  const note = useAppSelector((state) => state.notes.notesById[noteId]);
  const editMode = mode == 'edit';
  const selectMode = mode == 'select';
  return (
    <NoteBox
      component="div"
      tabIndex={0}
      sx={customStyles}
      onClick={() => onClick && onClick()}
      isFocused={isFocused}
      mode={mode}
    >
      {editMode && (
        <>
          <NoteTextField field="title" note={note} />
          <NoteTextField field="content" note={note} />
        </>
      )}
      {!editMode && (
        <>
          <Typography variant="h6" component="h2">
            {note.title}
          </Typography>
          <Typography sx={{ mt: 2 }}>{note?.content}</Typography>
        </>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {/* <NoteLabels
          labelsIds={note.labels as string[]}
          noteId={note.id as string}
        /> */}
        {editMode && (
          <Typography variant="h6" component="h2">
            {note.updatedAt || note.createdAt}
          </Typography>
        )}
      </div>
      <Options
        isFocused={isFocused}
        note={note}
        onOptionsClick={!selectMode ? onOptionsClick : onClick}
      />
    </NoteBox>
  );
};

export default Note;

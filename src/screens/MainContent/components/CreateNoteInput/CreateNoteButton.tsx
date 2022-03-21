import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import BrushIcon from '@mui/icons-material/Brush';
import PaletteIcon from '@mui/icons-material/Palette';
import IconButton from '@mui/material/IconButton';

import { useAppDispatch } from 'hooks';
import { noteActions } from '#redux/slices';

const stopPropagation = (e: any) => e.stopPropagation();

interface CreateNoteButtonProps {
  onCreatedNote: (noteId: string) => void;
}

const CreateNoteButton = ({ onCreatedNote }: CreateNoteButtonProps) => {
  const dispatch = useAppDispatch();
  const onClickHandler = () =>
    dispatch(noteActions.createNote({}))
      .unwrap()
      .then(({ id: noteId }) => onCreatedNote(noteId as string));

  return (
    <Box
      component="div"
      onClick={onClickHandler}
      sx={{
        width: '400px',
        boxSizing: 'border-box',
        boxShadow: 10,
        border: '1px solid #000',
        height: '50px',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <Typography>Create new note ...</Typography>
      <Stack direction="row" spacing={2}>
        <IconButton onClick={stopPropagation}>
          <CheckBoxIcon />
        </IconButton>
        <IconButton onClick={stopPropagation}>
          <BrushIcon />
        </IconButton>
        <IconButton onClick={stopPropagation}>
          <PaletteIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default CreateNoteButton;

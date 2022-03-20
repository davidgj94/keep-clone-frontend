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
import { noteActions } from '#redux/slices';
import { definitions } from 'types/swagger';

interface OptionsProps {
  isFocused: boolean;
  note: definitions['Note'];
  onOptionsClick?: () => void;
}

const Options = ({ isFocused, note, onOptionsClick }: OptionsProps) => {
  const dispatch = useAppDispatch();
  const handleArchive = () =>
    dispatch(
      noteActions.modifyAndInvalidateNote({
        noteId: note.id as string,
        note: { archived: true },
      })
    );
  return (
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
      <IconButton size="small" color="inherit" onClick={handleArchive}>
        <ArchiveIcon />
      </IconButton>
      <MoreButton allowOpenPopover={isFocused} note={note} />
    </Stack>
  );
};

export default Options;

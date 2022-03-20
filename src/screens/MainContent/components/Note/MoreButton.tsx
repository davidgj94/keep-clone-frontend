import React, { useRef, useState, useEffect } from 'react';
import { omit } from 'lodash';

import MoreVert from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { CSSObject, styled, SxProps, Theme } from '@mui/material/styles';

import { definitions } from 'types/swagger';
import { useAppDispatch } from 'hooks';
import { noteActions } from '#redux/slices';

const TextButton = styled(Button)(() => ({
  textTransform: 'none',
  color: 'black',
  justifyContent: 'flex-start',
}));

interface MoreButtonProps {
  allowOpenPopover: boolean;
  note: definitions['Note'];
}

const MoreButton = ({ allowOpenPopover, note }: MoreButtonProps) => {
  const dispatch = useAppDispatch();
  const [openPopover, setOpenPopover] = useState(false);
  const togglePopover = () => setOpenPopover((prev) => !prev);
  const ref = useRef(null);

  useEffect(() => {
    if (openPopover && !allowOpenPopover) setOpenPopover(false);
  }, [allowOpenPopover]);

  const handleCopyNote = () => {
    dispatch(noteActions.createAndInsertNote(omit(note, 'id')));
    togglePopover();
  };

  return (
    <>
      <IconButton
        size="small"
        color="inherit"
        ref={ref}
        onClick={togglePopover}
      >
        <MoreVert />
      </IconButton>
      {openPopover && (
        <Box
          sx={{
            position: 'fixed',
            top: (ref.current as any).getBoundingClientRect().bottom,
            left: (ref.current as any).getBoundingClientRect().left,
            border: '1px solid #000',
            borderRadius: 1,
            zIndex: 20,
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TextButton>Delete note</TextButton>
          <TextButton onClick={handleCopyNote}>Create a copy</TextButton>
        </Box>
      )}
    </>
  );
};

export default MoreButton;

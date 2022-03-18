import React, { useRef, useState, useEffect } from 'react';

import MoreVert from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

interface MoreButtonProps {
  allowOpenPopover: boolean;
}

const MoreButton = ({ allowOpenPopover }: MoreButtonProps) => {
  const [openPopover, setOpenPopover] = useState(false);
  const togglePopover = () => setOpenPopover((prev) => !prev);
  const ref = useRef(null);

  useEffect(() => {
    if (openPopover && !allowOpenPopover) setOpenPopover(false);
  }, [allowOpenPopover]);

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
            width: '100px',
            height: '200px',
          }}
        >
          aaaaa
        </Box>
      )}
    </>
  );
};

export default MoreButton;

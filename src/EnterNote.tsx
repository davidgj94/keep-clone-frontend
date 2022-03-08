import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { CSSTransition } from 'react-transition-group';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const EnterNote = () => {
  const [showButton, setShowButton] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  return (
    <>
      {showButton && (
        <Paper onClick={() => setShowMessage(true)}>Show Message</Paper>
      )}
      <CSSTransition
        in={showMessage}
        timeout={300}
        unmountOnExit
        onEnter={() => setShowButton(false)}
        onExited={() => setShowButton(true)}
      >
        <Paper>
          <Typography variant="h6" component="h6" color="black">
            Title
          </Typography>
          Content
          <Button onClick={() => setShowMessage(false)}>Close</Button>
        </Paper>
      </CSSTransition>
    </>
  );
};

export default EnterNote;

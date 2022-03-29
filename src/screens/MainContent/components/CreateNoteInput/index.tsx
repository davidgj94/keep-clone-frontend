import React, { useState, useEffect } from 'react';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import { CSSTransition } from 'react-transition-group';
import { flow } from 'lodash';

import { useAppDispatch } from 'hooks';
import { labelActions, noteActions } from '#redux/slices';
import Note from '../Note';
import CreateNoteButton from './CreateNoteButton';

type CreateNoteStates = 'idle' | 'creating' | 'created';

const CreateNoteInput = () => {
  const dispatch = useAppDispatch();
  const [newNoteId, setNewNoteId] = useState<string | undefined>();
  const [createNoteState, setCreateNoteState] =
    useState<CreateNoteStates>('idle');

  const onExitCreateNote = flow([
    () => dispatch(noteActions.insertIfNotEmpty(newNoteId as string)),
    () => setCreateNoteState('idle'),
  ]);

  useEffect(() => {
    if (newNoteId !== undefined) setCreateNoteState('creating');
  }, [newNoteId, setCreateNoteState]);

  useEffect(() => {
    if (createNoteState == 'idle') setNewNoteId(undefined);
  }, [createNoteState, setNewNoteId]);

  return (
    <>
      {createNoteState == 'idle' && (
        <CreateNoteButton
          onCreatedNote={(noteId: string) => setNewNoteId(noteId)}
        />
      )}
      <CSSTransition
        in={createNoteState == 'creating'}
        timeout={300}
        unmountOnExit
        onExited={onExitCreateNote}
      >
        <ClickAwayListener
          onClickAway={() => setCreateNoteState('created')}
          mouseEvent="onClick"
        >
          <div>
            <Note noteId={newNoteId as string} mode="edit" />
          </div>
        </ClickAwayListener>
      </CSSTransition>
    </>
  );
};

export default CreateNoteInput;

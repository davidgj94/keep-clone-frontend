import React, { useState, useEffect } from 'react';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import { CSSTransition } from 'react-transition-group';
import { flow } from 'lodash';

import { useAppDispatch, useAppSelector } from 'hooks';
import { noteActions } from '#redux/slices';
import Note from '../Note';
import CreateNoteButton from './CreateNoteButton';
import { isLabelQuery } from '#redux/slices/notes';

type CreateNoteStates = 'idle' | 'creating' | 'created';

interface CreateNoteInputProps {
  open: boolean;
  onButtonClick: () => void;
  onClose: () => void;
}

const CreateNoteInput = ({
  open,
  onButtonClick,
  onClose,
}: CreateNoteInputProps) => {
  const dispatch = useAppDispatch();
  const labelId = useAppSelector((state) => {
    const { query } = state.notes.noteList;
    if (isLabelQuery(query)) return query.labelId;
  });
  const [newNoteId, setNewNoteId] = useState<string | undefined>();
  const [createNoteState, setCreateNoteState] =
    useState<CreateNoteStates>('idle');

  const onExitCreateNote = flow([
    () => dispatch(noteActions.insertIfNotEmpty(newNoteId as string)),
    () => setCreateNoteState('idle'),
    onClose,
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
          labelId={labelId}
          onCreatedNote={flow([
            (noteId: string) => setNewNoteId(noteId),
            onButtonClick,
          ])}
        />
      )}
      <CSSTransition
        in={createNoteState == 'creating' && open}
        timeout={0}
        unmountOnExit
        onExited={onExitCreateNote}
      >
        <ClickAwayListener
          onClickAway={() => setCreateNoteState('created')}
          mouseEvent="onClick"
        >
          <div>
            <Note noteId={newNoteId as string} mode="create" />
          </div>
        </ClickAwayListener>
      </CSSTransition>
    </>
  );
};

export default CreateNoteInput;

import React, { useState, useEffect } from 'react';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import { CSSTransition } from 'react-transition-group';
import { flow } from 'lodash';

import { useAppSelector, useAppDispatch } from 'hooks';
import { labelActions, noteActions } from '#redux/slices';
import Note from './components/Note';
import NoteModal from './components/NoteModal';
import NoteBadgeHOC from './components/NoteBadgeHOC';
import CreateNoteInput from './components/CreateNoteInput';

const App = () => {
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = React.useState(false);
  const toggleModal = () => setOpenModal((prev) => !prev);
  const [focusedNoteId, setFocusedNoteId] = React.useState<
    string | undefined
  >();
  const [selectMode, setSelectMode] = React.useState(false);
  const [selectedNotesIds, setSelectedNotesIds] = React.useState<string[]>([]);

  const notes = useAppSelector((state) =>
    state.notes.noteList.data.map((noteId) => state.notes.notesById[noteId])
  );

  console.log(notes);

  const isNoteFocused = (noteId: string | undefined) =>
    noteId === focusedNoteId;

  useEffect(() => {
    dispatch(labelActions.fetchLabels());
    dispatch(noteActions.fetchNotes({}));
  }, []);

  return (
    <>
      <div
        style={{
          marginRight: 'auto',
          marginLeft: 'auto',
          width: '400px',
          marginBottom: '40px',
        }}
      >
        <CreateNoteInput />
      </div>
      {notes.map((note, index) => (
        <div
          key={note.id}
          style={{
            marginRight: 'auto',
            marginLeft: 'auto',
            width: '400px',
            marginTop: '20px',
            marginBottom: '20px',
            ...(openModal
              ? {
                  visibility: !isNoteFocused(note.id) ? 'visible' : 'hidden',
                }
              : {}),
          }}
        >
          <ClickAwayListener
            onClickAway={() => {
              console.log(index);
              setFocusedNoteId(undefined);
            }}
            mouseEvent={!openModal ? 'onClick' : false}
          >
            <NoteBadgeHOC
              badgeVisible={isNoteFocused(note.id)}
              onBadgeClick={() => setSelectMode(true)}
            >
              <Note
                noteId={note.id as string}
                onClick={flow([toggleModal, () => setFocusedNoteId(note.id)])}
                onOptionsClick={() => setFocusedNoteId(note.id)}
                isFocused={isNoteFocused(note.id)}
              />
            </NoteBadgeHOC>
          </ClickAwayListener>
        </div>
      ))}
      <NoteModal
        noteId={focusedNoteId}
        onClose={toggleModal}
        open={openModal}
      />
    </>
  );
};

export default App;

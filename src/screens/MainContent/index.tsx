import React, { useState } from 'react';

import ClickAwayListener from '@mui/material/ClickAwayListener';

import { flow } from 'lodash';

import { useAppSelector } from '../../hooks';
import Note from './components/Note';
import NoteModal from './components/NoteModal';
import NoteBadgeHOC from './components/NoteBadgeHOC';

const App = () => {
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

  const isNoteFocused = (noteId: string | undefined) =>
    noteId === focusedNoteId;

  return (
    <>
      {notes.map((note, index) => (
        <div
          key={index}
          style={{
            marginRight: 'auto',
            marginLeft: 'auto',
            width: '400px',
            marginBottom: '20px',
            ...(openModal
              ? {
                  visibility: !isNoteFocused(note.id) ? 'visible' : 'hidden',
                }
              : {}),
          }}
        >
          <ClickAwayListener
            onClickAway={() => setFocusedNoteId(undefined)}
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

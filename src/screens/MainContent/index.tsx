import React, { useState, useEffect } from 'react';

import config from 'config';

import { useAppSelector, useAppDispatch } from 'hooks';
import { labelActions, noteActions } from '#redux/slices';
import NoteModal from './components/NoteModal';
import CreateNoteInput from './components/CreateNoteInput';
import Item from './components/Item';
import InfiniteLoader from './components/InfiniteLoader';

const App = () => {
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = React.useState(false);
  const toggleModal = () => setOpenModal((prev) => !prev);
  const [focusedNoteId, setFocusedNoteId] = React.useState<
    string | undefined
  >();
  const [selectMode, setSelectMode] = React.useState(false);
  const [selectedNotesIds, setSelectedNotesIds] = React.useState<string[]>([]);

  const noteIdList = useAppSelector((state) => state.notes.noteList.data);
  const labelIdList = useAppSelector((state) => state.labels.labelsList);
  const hasMore = useAppSelector((state) => state.notes.noteList.hasMore);

  const loadMore = async () => void dispatch(noteActions.fetchNotes({}));

  const onBadgeClick = () => setSelectMode(true);

  const onClick = !selectMode ? toggleModal : undefined;

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

      <InfiniteLoader hasMore={hasMore} loadMore={loadMore}>
        {noteIdList && labelIdList && (
          <>
            {noteIdList.map((noteId) => (
              <Item
                focusedNoteId={focusedNoteId}
                setFocusedNoteId={setFocusedNoteId}
                isModalOpen={openModal}
                onBadgeClick={onBadgeClick}
                onClick={onClick}
                key={noteId}
                noteId={noteId}
                mode={selectMode ? 'select' : 'display'}
              />
            ))}
          </>
        )}
      </InfiniteLoader>
      <NoteModal
        noteId={focusedNoteId}
        onClose={toggleModal}
        open={openModal}
      />
    </>
  );
};

export default App;

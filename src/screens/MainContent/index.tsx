import React, { useState, useEffect, useReducer, Reducer } from 'react';
import { flow } from 'lodash';

import config from 'config';
import { useAppSelector, useAppDispatch } from 'hooks';
import { labelActions, noteActions } from '#redux/slices';
import NoteModal from './components/NoteModal';
import CreateNoteInput from './components/CreateNoteInput';
import Item from './components/Item';
import InfiniteLoader from './components/InfiniteLoader';

type SelectModeActionTypes = 'INSERT_NOTE' | 'RESET';

interface SelectModeState {
  selectMode: boolean;
  selectedNotesIds: string[];
}

const selectModeInitialState: SelectModeState = {
  selectMode: false,
  selectedNotesIds: [],
};

const selectModeInsert = (
  noteId: string
): { type: SelectModeActionTypes; payload: string } => ({
  type: 'INSERT_NOTE',
  payload: noteId,
});

const selectModeReset = (): { type: SelectModeActionTypes } => ({
  type: 'RESET',
});

const selectModeReducer: Reducer<
  SelectModeState,
  { type: SelectModeActionTypes; payload?: string }
> = (state, action) => {
  switch (action.type) {
    case 'INSERT_NOTE':
      return {
        selectMode: true,
        selectedNotesIds: [...state.selectedNotesIds, action.payload as string],
      };
    case 'RESET':
      return selectModeInitialState;
    default:
      return state;
  }
};

const App = () => {
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = React.useState(false);
  const toggleModal = () => setOpenModal((prev) => !prev);
  const [focusedNoteId, setFocusedNoteId] = React.useState<
    string | undefined
  >();

  const noteIdList = useAppSelector((state) => state.notes.noteList.data);
  const labelIdList = useAppSelector((state) => state.labels.labelsList);
  const hasMore = useAppSelector((state) => state.notes.noteList.hasMore);
  const selectedNotesIds = useAppSelector((state) => state.notes.selectedNotes);
  const selectMode = selectedNotesIds.length > 0;

  const loadMore = async () => void dispatch(noteActions.fetchNotes());

  const isNoteSelected = (noteId: string) => selectedNotesIds.includes(noteId);
  const isNoteFocused = (noteId: string) =>
    !selectMode ? noteId === focusedNoteId : isNoteSelected(noteId);

  const toggleSelectNote = (noteId: string) =>
    dispatch(
      !isNoteSelected(noteId)
        ? noteActions.insertSelected(noteId)
        : noteActions.removeSelected(noteId)
    );

  const onClickFactory = (noteId: string) =>
    !selectMode
      ? flow([toggleModal, () => setFocusedNoteId(noteId)])
      : () => toggleSelectNote(noteId);

  const onClickAway = () =>
    !selectMode
      ? setFocusedNoteId(undefined)
      : dispatch(noteActions.resetSelected());

  useEffect(() => {
    dispatch(labelActions.fetchLabels());
    dispatch(noteActions.fetchNotes());
  }, []);

  console.log(selectedNotesIds);

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
                isModalOpen={openModal}
                onBadgeClick={() => toggleSelectNote(noteId)}
                onClick={onClickFactory(noteId)}
                onOptionsClick={
                  !selectMode ? () => setFocusedNoteId(noteId) : undefined
                }
                onClickAway={onClickAway}
                isNoteFocused={isNoteFocused(noteId)}
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

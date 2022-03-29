import React, { createContext, useContext } from 'react';
import { flow } from 'lodash';

import ClickAwayListener from '@mui/material/ClickAwayListener';

import { useAppSelector } from 'hooks';
import Note from './Note';
import NoteBadgeHOC from './NoteBadgeHOC';

interface ItemContextValue {
  focusedNoteId: string;
  setFocusedNoteId: (noteId: string | undefined) => void;
  isModalOpen: boolean;
  onBadgeClick: () => void;
  toggleModal: () => void;
}

export const ItemContext = createContext<ItemContextValue>(
  {} as ItemContextValue
);

interface ItemProps {
  noteId?: string;
  focusedNoteId: string | undefined;
  setFocusedNoteId: (noteId: string | undefined) => void;
  isModalOpen: boolean;
  onBadgeClick: () => void;
  onClick?: () => void;
  mode: 'display' | 'select';
}

const Item = ({
  noteId,
  isModalOpen,
  focusedNoteId,
  onBadgeClick,
  onClick,
  setFocusedNoteId,
  mode,
}: ItemProps) => {
  if (!noteId) return <></>;
  const isNoteFocused = noteId === focusedNoteId;
  return (
    <div
      key={noteId}
      style={{
        marginRight: 'auto',
        marginLeft: 'auto',
        width: '400px',
        marginTop: '20px',
        marginBottom: '20px',
        ...(isModalOpen
          ? {
              visibility: !isNoteFocused ? 'visible' : 'hidden',
            }
          : {}),
      }}
    >
      <ClickAwayListener
        onClickAway={() => setFocusedNoteId(undefined)}
        mouseEvent={!isModalOpen && isNoteFocused ? 'onClick' : false}
      >
        <NoteBadgeHOC badgeVisible={isNoteFocused} onBadgeClick={onBadgeClick}>
          <Note
            noteId={noteId as string}
            onClick={
              onClick
                ? flow([onClick, () => setFocusedNoteId(noteId)])
                : () => setFocusedNoteId(noteId)
            }
            onOptionsClick={() => setFocusedNoteId(noteId)}
            isFocused={isNoteFocused}
            mode={mode}
          />
        </NoteBadgeHOC>
      </ClickAwayListener>
    </div>
  );
};

export default Item;

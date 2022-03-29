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
  noteId: string;
  isModalOpen: boolean;
  isNoteFocused: boolean;
  onClickAway: () => void;
  onBadgeClick: () => void;
  onClick: () => void;
  onOptionsClick?: () => void;
  mode: 'display' | 'select';
}

const Item = ({
  noteId,
  isModalOpen,
  isNoteFocused,
  onBadgeClick,
  onClick,
  onClickAway,
  onOptionsClick,
  mode,
}: ItemProps) => (
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
      onClickAway={onClickAway}
      mouseEvent={!isModalOpen && isNoteFocused ? 'onClick' : false}
    >
      <NoteBadgeHOC badgeVisible={isNoteFocused} onBadgeClick={onBadgeClick}>
        <Note
          noteId={noteId as string}
          onClick={onClick}
          onOptionsClick={onOptionsClick || onClick}
          isFocused={isNoteFocused}
          mode={mode}
        />
      </NoteBadgeHOC>
    </ClickAwayListener>
  </div>
);

export default Item;

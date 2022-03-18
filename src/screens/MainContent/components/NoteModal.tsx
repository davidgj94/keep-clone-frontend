import React from 'react';

import Modal from '@mui/material/Modal';
import { SxProps, Theme } from '@mui/material/styles';

import Note from './Note';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
} as SxProps<Theme>;

interface ModalProps {
  noteId?: string;
  open: boolean;
  onClose: () => void;
}

const NoteModal = ({ noteId, open, onClose }: ModalProps) => (
  <Modal open={open} onClose={onClose}>
    {noteId ? (
      <Note noteId={noteId} customStyles={modalStyle} editMode />
    ) : (
      <></>
    )}
  </Modal>
);

export default NoteModal;

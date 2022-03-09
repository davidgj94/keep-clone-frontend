import * as React from 'react';
import { styled, Theme, CSSObject, alpha, SxProps } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const NoteBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hideOptions',
})<{
  hideOptions?: boolean;
}>(({ hideOptions, theme }) => ({
  width: 400,
  border: '1px solid #000',
  boxShadow: 'none',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  ':hover': { boxShadow: theme.shadows[10] },
  ...(hideOptions
    ? {
        '.options': { visibility: 'hidden' } as CSSObject,
        ':hover .options': { visibility: 'visible' } as CSSObject,
      }
    : {}),
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
} as SxProps<Theme>;

const listStyle = {
  marginRight: 'auto',
  marginLeft: 'auto',
  marginTop: 2,
  marginBottom: 2,
} as SxProps<Theme>;

interface Note {
  title: string;
  content: string;
  labels: string[];
}

interface NoteProps {
  note?: Note;
  customStyles?: SxProps<Theme>;
  onClick?: () => void;
  hideOptions?: boolean;
}

const Note = ({
  note,
  customStyles,
  onClick,
  hideOptions = false,
}: NoteProps) => (
  <NoteBox
    component="div"
    sx={customStyles}
    onClick={onClick}
    hideOptions={hideOptions}
  >
    <Typography variant="h6" component="h2">
      {note?.title || ''}
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      {note?.content || ''}
    </Typography>
    <Stack direction="row" spacing={1}>
      {note?.labels?.map((label) => (
        <Chip
          key={label}
          label={label}
          onDelete={() => ''}
          onClick={(e) => e.stopPropagation()}
        />
      ))}
    </Stack>
    <Stack
      direction="row"
      spacing={1}
      className="options"
      onClick={(e) => e.stopPropagation()}
    >
      {note?.labels?.map((label) => (
        <Chip key={label} label={label} />
      ))}
    </Stack>
  </NoteBox>
);

interface ModalProps {
  note?: Note;
  open: boolean;
  onClose: () => void;
}

const CustomModal = ({ note, open, onClose }: ModalProps) => (
  <Modal open={open} onClose={onClose}>
    <Note note={note} customStyles={modalStyle} />
  </Modal>
);

const App = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const toggleModal = () => setOpenModal((prev) => !prev);
  const [noteIdx, setNoteIdx] = React.useState<number | undefined>();

  const notes = [
    { title: 'title1', content: 'aaaaaaaaaaaaaa', labels: ['aaa', 'bbb'] },
    { title: 'title2', content: 'bbbbbbbbbbbbbb', labels: ['aaa', 'bbb'] },
  ];
  return (
    <div>
      {notes.map((note, index) => (
        <Note
          key={index}
          note={note}
          customStyles={{
            ...listStyle,
            visibility: index !== noteIdx ? 'visible' : 'hidden',
          }}
          onClick={() => {
            toggleModal();
            setNoteIdx(index);
          }}
          hideOptions
        />
      ))}
      <CustomModal
        note={noteIdx !== undefined ? notes[noteIdx] : undefined}
        onClose={() => {
          toggleModal();
          setNoteIdx(undefined);
        }}
        open={openModal}
      />
    </div>
  );
};

export default App;

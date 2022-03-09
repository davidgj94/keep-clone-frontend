import * as React from 'react';
import { styled, Theme, CSSObject, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
};

const baseStyle = {
  width: 400,
  border: '1px solid #000',
  boxShadow: 'none',
  p: 4,
  borderRadius: 1,
  ':hover': { boxShadow: 10 },
};

const listStyle = {
  marginRight: 'auto',
  marginLeft: 'auto',
  marginTop: 2,
  marginBottom: 2,
};

interface NoteProps {
  title: string;
  content: string;
  customStyles?: any;
  labels: React.ReactNode;
  onClick?: () => void;
}

const Note = ({ title, content, customStyles, labels, onClick }: NoteProps) => (
  <Box component="div" sx={{ ...baseStyle, ...customStyles }} onClick={onClick}>
    <Typography variant="h6" component="h2">
      {title}
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      {content}
    </Typography>
    {labels}
  </Box>
);

interface LabelsStackProps {
  labels: string[];
}

const LabelsStack = ({ labels }: LabelsStackProps) => (
  <Stack direction="row" spacing={1}>
    {labels.map((label) => (
      <Chip key={label} label={label} onDelete={() => ''} />
    ))}
  </Stack>
);

interface ModalProps {
  title?: string;
  content?: string;
  labels: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

const CustomModal = ({ title, content, open, onClose, labels }: ModalProps) => (
  <Modal open={open} onClose={onClose}>
    <Note
      title={title || ''}
      content={content || ''}
      customStyles={modalStyle}
      labels={labels}
    />
  </Modal>
);

const App = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const toggleModal = () => setOpenModal((prev) => !prev);
  const [noteIdx, setNoteIdx] = React.useState<number | undefined>();

  const notes = [
    { title: 'title1', content: 'aaaaaaaaaaaaaa' },
    { title: 'title2', content: 'bbbbbbbbbbbbbb' },
  ];
  return (
    <div>
      {notes.map((note, index) => (
        <Note
          key={index}
          title={note.title}
          content={note.content}
          customStyles={{
            ...listStyle,
            visibility: index !== noteIdx ? 'visible' : 'hidden',
          }}
          labels={<LabelsStack labels={['aa', 'bb']} />}
          onClick={() => {
            toggleModal();
            setNoteIdx(index);
          }}
        />
      ))}
      <CustomModal
        title={noteIdx !== undefined ? notes[noteIdx].title : ''}
        content={noteIdx !== undefined ? notes[noteIdx].content : ''}
        onClose={() => {
          toggleModal();
          setNoteIdx(undefined);
        }}
        labels={<LabelsStack labels={['aa', 'bb']} />}
        open={openModal}
      />
    </div>
  );
};

export default App;

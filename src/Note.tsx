import * as React from 'react';
import { styled, Theme, CSSObject, alpha, SxProps } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import MoreVert from '@mui/icons-material/MoreVert';
import ArchiveIcon from '@mui/icons-material/Archive';
import ImageIcon from '@mui/icons-material/Image';
import PaletteIcon from '@mui/icons-material/Palette';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Badge from '@mui/material/Badge';
import PushPinIcon from '@mui/icons-material/PushPin';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { flow } from 'lodash';

const NoteBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{
  isSelected?: boolean;
}>(({ theme, isSelected }) => ({
  width: '400px',
  boxSizing: 'border-box',
  border: '1px solid #000',
  boxShadow: 'none',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  '.options': { visibility: 'hidden' },
  ':hover': { boxShadow: theme.shadows[10] },
  ':hover .options': { visibility: 'visible' } as CSSObject,
  ...(isSelected ? { '.options': { visibility: 'inherit' } } : {}),
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
  //   marginTop: 2,
  //   marginBottom: 2,
} as SxProps<Theme>;

interface Note {
  title: string;
  content: string;
  labels: string[];
  id: string;
}

interface MoreButtonProps {
  allowOpenPopover: boolean;
}

const MoreButton = ({ allowOpenPopover }: MoreButtonProps) => {
  const [openPopover, setOpenPopover] = React.useState(false);
  const togglePopover = () => setOpenPopover((prev) => !prev);
  const ref = React.useRef(null);
  return (
    <>
      <IconButton
        size="small"
        color="inherit"
        ref={ref}
        onClick={togglePopover}
      >
        <MoreVert />
      </IconButton>
      {allowOpenPopover && openPopover && (
        <Box
          sx={{
            position: 'fixed',
            top: (ref.current as any).getBoundingClientRect().bottom,
            left: (ref.current as any).getBoundingClientRect().left,
            width: '100px',
            height: '200px',
          }}
        >
          aaaaa
        </Box>
      )}
    </>
  );
};

interface NoteProps {
  note?: Note;
  customStyles?: SxProps<Theme>;
  onClick?: () => void;
  onOptionsClick?: () => void;
  isSelected?: boolean;
}

const Note = ({
  note,
  customStyles,
  onClick,
  onOptionsClick,
  isSelected = false,
}: NoteProps) => (
  <NoteBox
    component="div"
    tabIndex={0}
    sx={customStyles}
    onClick={() => onClick && onClick()}
    isSelected={isSelected}
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
      onClick={(e) => {
        if (onOptionsClick) {
          onOptionsClick();
          e.stopPropagation();
        }
      }}
    >
      <IconButton size="small" color="inherit">
        <AddAlertIcon />
      </IconButton>
      <IconButton size="small" color="inherit">
        <PersonAddAlt1Icon />
      </IconButton>
      <IconButton size="small" color="inherit">
        <PaletteIcon />
      </IconButton>
      <IconButton size="small" color="inherit">
        <ImageIcon />
      </IconButton>
      <IconButton size="small" color="inherit">
        <ArchiveIcon />
      </IconButton>
      <MoreButton allowOpenPopover={isSelected} />
    </Stack>
  </NoteBox>
);

const NoteBadgeHOC = React.forwardRef(
  (
    {
      children,
      isSelected,
      onBadgeClick,
    }: {
      children: React.ReactElement;
      isSelected: boolean;
      onBadgeClick: () => void;
    },
    ref
  ) => {
    const [showBadge, setShowBadge] = React.useState(false);
    return (
      <Badge
        component="div"
        badgeContent={<PushPinIcon sx={{ fontSize: '1.5em' }} />}
        invisible={!(isSelected || showBadge)}
        color="secondary"
        // @ts-expect-error error
        ref={ref}
        onClick={flow([(e) => e.stopPropagation(), onBadgeClick])}
        onMouseEnter={() => setShowBadge(true)}
        onMouseLeave={() => setShowBadge(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {children}
      </Badge>
    );
  }
);

NoteBadgeHOC.displayName = 'NoteBadgeHOC';

interface ModalProps {
  note?: Note;
  open: boolean;
  onClose: () => void;
}

const CustomModal = ({ note, open, onClose }: ModalProps) => (
  <Modal open={open} onClose={onClose}>
    <Note note={note} customStyles={modalStyle} isSelected />
  </Modal>
);

const App = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const toggleModal = () => setOpenModal((prev) => !prev);
  const [noteIdx, setNoteIdx] = React.useState<number | undefined>();
  const [selectMode, setSelectMode] = React.useState(false);
  const [selectedNotes, setSelectedNotes] = React.useState<Note[]>([]);

  const notes: Note[] = [
    {
      id: '123',
      title: 'title1',
      content: 'aaaaaaaaaaaaaa',
      labels: ['aaa', 'bbb'],
    },
    {
      id: '345',
      title: 'title2',
      content: 'bbbbbbbbbbbbbb',
      labels: ['aaa', 'bbb'],
    },
  ];

  const isNoteSelected = (index: number) => index === noteIdx;
  console.log(noteIdx);

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
                  visibility: !isNoteSelected(index) ? 'visible' : 'hidden',
                }
              : {}),
          }}
        >
          <ClickAwayListener
            onClickAway={() => setNoteIdx(undefined)}
            mouseEvent={!openModal ? 'onClick' : false}
          >
            <NoteBadgeHOC
              isSelected={isNoteSelected(index)}
              onBadgeClick={() => ''}
            >
              <Note
                note={note}
                onClick={flow([toggleModal, () => setNoteIdx(index)])}
                onOptionsClick={() => setNoteIdx(index)}
                isSelected={isNoteSelected(index)}
              />
            </NoteBadgeHOC>
          </ClickAwayListener>
        </div>
      ))}
      <CustomModal
        note={noteIdx !== undefined ? notes[noteIdx] : undefined}
        onClose={toggleModal}
        open={openModal}
      />
    </>
  );
};

export default App;

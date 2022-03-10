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
import Popover from '@mui/material/Popover/Popover';
import Badge from '@mui/material/Badge';
import PushPinIcon from '@mui/icons-material/PushPin';

import { flow } from 'lodash';

const NoteBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hideOptions',
})<{
  hideOptions?: boolean;
}>(({ hideOptions, theme }) => ({
  width: '400px',
  boxSizing: 'border-box',
  border: '1px solid #000',
  boxShadow: 'none',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  '.options': { visibility: 'hidden' },
  ':hover': { boxShadow: theme.shadows[10] },
  ':hover .options': { visibility: 'visible' } as CSSObject,
  ':focus .options': { visibility: 'visible' } as CSSObject,
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
}

const MoreButton = () => {
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
      <Popover
        open={openPopover}
        anchorEl={ref.current}
        onClose={togglePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
    </>
  );
};

interface NoteProps {
  note?: Note;
  customStyles?: SxProps<Theme>;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  hideOptions?: boolean;
}

const Note = ({
  note,
  customStyles,
  onClick,
  onFocus,
  onBlur,
  hideOptions = false,
}: NoteProps) => (
  <NoteBox
    component="div"
    tabIndex={0}
    sx={customStyles}
    onFocus={() => {
      if (onFocus) onFocus();
    }}
    onBlur={() => {
      if (onBlur) onBlur();
    }}
    onClick={() => {
      if (onClick) onClick();
    }}
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
      onClick={(e) => {
        e.stopPropagation();
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
      <MoreButton />
    </Stack>
  </NoteBox>
);

const NoteBadgeHOC = ({ children }: { children: React.ReactElement }) => {
  const [focus, setFocus] = React.useState(false);
  const toggleFocus = () => setFocus((prev) => !prev);
  return (
    <Badge
      component="span"
      badgeContent={focus ? <PushPinIcon sx={{ fontSize: '1.5em' }} /> : null}
      color="secondary"
    >
      {React.cloneElement(children, {
        onFocus: toggleFocus,
        onBlur: toggleFocus,
      })}
    </Badge>
  );
};

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

  const isNoteSelected = (index: number) => index === noteIdx;

  return (
    <>
      {notes.map((note, index) => (
        <div
          key={index}
          style={{
            marginRight: 'auto',
            marginLeft: 'auto',
            width: '400px',
            ...(openModal
              ? {
                  visibility: !isNoteSelected(index) ? 'visible' : 'hidden',
                }
              : {}),
          }}
        >
          <NoteBadgeHOC>
            <Note
              note={note}
              onClick={flow([toggleModal, () => setNoteIdx(index)])}
              hideOptions
            />
          </NoteBadgeHOC>
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
import React, { useEffect, useState } from 'react';

import Modal from '@mui/material/Modal';
import { SxProps, Theme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import LabelIcon from '@mui/icons-material/Label';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';

import { useAppSelector, useAppDispatch } from 'hooks';
import { Box } from '@mui/material';
import { flow } from 'lodash';
import { labelActions } from '#redux/slices';
import { definitions } from 'types/swagger';

type Label = definitions['Label'];

interface CreateLabelListItemProps {
  creating: boolean;
  onCreate: (labelName: string) => void;
  onClose: () => void;
  onClick: () => void;
}

const CreateLabelListItem = ({
  creating,
  onCreate,
  onClick,
  onClose,
}: CreateLabelListItemProps) => {
  const onListItemClick = (e: any) =>
    creating && flow([() => e.stopPropagation(), onClose])();
  const [labelName, setLabelName] = useState<string | undefined>();
  return (
    <ListItem
      onClick={onClick}
      secondaryAction={
        creating ? (
          <IconButton onClick={() => labelName && onCreate(labelName)}>
            <DoneIcon />
          </IconButton>
        ) : null
      }
    >
      <ListItemIcon>
        <IconButton onClick={onListItemClick}>
          {creating ? <CloseIcon /> : <AddIcon />}
        </IconButton>
      </ListItemIcon>
      <ListItemText>
        <TextField
          variant="standard"
          InputProps={{
            spellCheck: 'false',
            ...(!creating ? { disableUnderline: true } : {}),
          }}
          placeholder="Create new label"
          value={labelName}
          onChange={(e) => setLabelName(e.target.value)}
        />
      </ListItemText>
    </ListItem>
  );
};

interface EditLabelListItemProps {
  label: Label;
  onDelete: () => void;
  onLabelChange: () => void;
  editing: boolean;
  onClick: () => void;
}

const EditLabelListItem = ({
  label,
  onDelete,
  onLabelChange,
  onClick,
  editing,
}: EditLabelListItemProps) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  return (
    <ListItem
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
      onClick={onClick}
      secondaryAction={
        <IconButton>{editing ? <DoneIcon /> : <EditIcon />}</IconButton>
      }
    >
      <ListItemIcon>
        <IconButton onClick={onDelete}>
          {editing || showDeleteIcon ? <DeleteIcon /> : <LabelIcon />}
        </IconButton>
      </ListItemIcon>
      <ListItemText>
        <TextField
          variant="standard"
          InputProps={{
            spellCheck: 'false',
            ...(!editing ? { disableUnderline: true } : {}),
          }}
          inputProps={{ style: { fontWeight: 'bold' } }}
          value={label.name}
        />
      </ListItemText>
    </ListItem>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
} as SxProps<Theme>;

interface ModalProps {
  open: boolean;
}

const EditLabelsModal = ({ open }: ModalProps) => {
  const dispatch = useAppDispatch();
  const labels = useAppSelector((state) => {
    const { labelsById, labelsList } = state.labels;
    return labelsList.map((labelId) => labelsById[labelId]);
  });

  const [creating, setCreating] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState<string | undefined>();
  const onCreateLabel = (labelName: string) =>
    dispatch(labelActions.createLabel(labelName));

  useEffect(() => {
    if (editingLabelId) setCreating(false);
  }, [editingLabelId]);

  const isEditing = (labelId: string) =>
    !creating && editingLabelId === labelId;

  return (
    <Modal open={open}>
      <Box sx={modalStyle}>
        <List>
          <CreateLabelListItem
            creating={creating}
            onClick={() => setCreating(true)}
            onClose={() => setCreating(false)}
            onCreate={onCreateLabel}
          />
          {labels.map((label) => (
            <EditLabelListItem
              key={label.id}
              label={label}
              editing={isEditing(label.id as string)}
              onClick={() => setEditingLabelId(label.id)}
              onDelete={() => ''}
              onLabelChange={() => ''}
            />
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default EditLabelsModal;

import React, { useCallback, useEffect, useRef, useState } from 'react';

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
import { flow, isEqual } from 'lodash';
import { labelActions } from '#redux/slices';
import { definitions } from 'types/swagger';

type Label = definitions['Label'];

interface CreateLabelListItemProps {
  creating: boolean;
  onClose: () => void;
  onClick: () => void;
}

const CreateLabelListItem = ({
  creating,
  onClick,
  onClose,
}: CreateLabelListItemProps) => {
  const dispatch = useAppDispatch();
  const onListItemClick = (e: any) =>
    creating && flow([() => e.stopPropagation(), onClose])();
  const [labelName, setLabelName] = useState<string | undefined>();
  const createLabel = () =>
    labelName && dispatch(labelActions.createLabel(labelName as string));
  return (
    <ListItem
      onClick={onClick}
      secondaryAction={
        creating ? (
          <IconButton onClick={() => createLabel()}>
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
  editing: boolean;
  onClick: () => void;
}

const EditLabelListItem = ({
  label,
  onClick,
  editing,
}: EditLabelListItemProps) => {
  const dispatch = useAppDispatch();
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [labelName, setLabelName] = useState(label.name as string);

  const mountRef = useRef(false);

  const saveChanges = useCallback(
    (labelName: string) =>
      void dispatch(
        labelActions.modifyLabel({
          labelId: label.id as string,
          label: { name: labelName },
        })
      ),
    [label]
  );

  useEffect(() => {
    if (mountRef.current && !editing) return saveChanges(labelName);
    mountRef.current = true;
  }, [editing, labelName, saveChanges, mountRef]);

  const onDelete = () => '';

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
          value={labelName}
          onChange={(e) => setLabelName(e.target.value)}
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
  onClose: () => void;
}

const EditLabelsModal = ({ open, onClose }: ModalProps) => {
  const labels = useAppSelector((state) => {
    const { labelsById, labelsList } = state.labels;
    return labelsList.map((labelId) => labelsById[labelId]);
  }, isEqual);

  const [creating, setCreating] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState<string | undefined>();

  useEffect(() => {
    if (editingLabelId) setCreating(false);
  }, [editingLabelId]);

  const isEditing = (labelId: string) =>
    !creating && editingLabelId === labelId;

  useEffect(() => {
    setEditingLabelId(undefined);
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <List>
          <CreateLabelListItem
            creating={creating}
            onClick={() => setCreating(true)}
            onClose={() => setCreating(false)}
          />
          {labels.map((label) => (
            <EditLabelListItem
              key={label.id}
              label={label}
              editing={isEditing(label.id as string)}
              onClick={() => setEditingLabelId(label.id)}
            />
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default EditLabelsModal;

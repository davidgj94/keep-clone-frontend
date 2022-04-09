import React, { useState, useEffect, useMemo } from 'react';

import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ArchiveIcon from '@mui/icons-material/Archive';
import LabelIcon from '@mui/icons-material/Label';
import EditIcon from '@mui/icons-material/Edit';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useAppSelector, useAppDispatch } from 'hooks';
import { labelActions, noteActions } from '#redux/slices';
import { flow, isEqual } from 'lodash';

interface DrawerListProps {
  open: boolean;
}

const DraweList = ({ open }: DrawerListProps) => {
  const dispatch = useAppDispatch();
  const [selectedItemName, setSelectedItemName] = useState('Notes');
  const [editLabels, setEditLabels] = useState(false);
  const labels = useAppSelector((state) => {
    const { labelsById, labelsList } = state.labels;
    return labelsList.map((labelId) => labelsById[labelId]);
  }, isEqual);

  const setAllNotes = () => dispatch(noteActions.setQueryAndRefetch({}));
  const setArchivedNotes = () =>
    dispatch(noteActions.setQueryAndRefetch({ archived: true }));
  const setLabelNotesFactory = (labelId: string) => () =>
    dispatch(noteActions.setQueryAndRefetch({ labelId }));

  const listItemNamesIcon: {
    [key: string]: { icon: React.ReactNode; effectFunc: () => void };
  } = {
    Notes: { icon: <LightbulbIcon />, effectFunc: setAllNotes },
    ...labels.reduce((acc, { name, id: labelId }) => {
      acc[name as string] = {
        icon: <LabelIcon />,
        effectFunc: setLabelNotesFactory(labelId as string),
      };
      return acc;
    }, {} as any),
    'Edit Labels': {
      icon: <EditIcon />,
      effectFunc: () => setEditLabels(true),
    },
    'Archived Notes': { icon: <ArchiveIcon />, effectFunc: setArchivedNotes },
  };

  return (
    <List>
      {Object.entries(listItemNamesIcon).map(
        ([itemName, { icon: iconComponent, effectFunc: onClickFunc }]) => (
          <ListItemButton
            key={itemName}
            selected={selectedItemName == itemName}
            onClick={flow([() => setSelectedItemName(itemName), onClickFunc])}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {iconComponent}
            </ListItemIcon>
            <ListItemText primary={itemName} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        )
      )}
    </List>
  );
};

export default DraweList;

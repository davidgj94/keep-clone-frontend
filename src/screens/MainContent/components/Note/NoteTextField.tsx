import React, { useState, useCallback } from 'react';
import { debounce, flow, over } from 'lodash';
import TextField from '@mui/material/TextField';

import { useAppSelector, useAppDispatch } from 'hooks';
import { noteActions } from '#redux/slices';
import { definitions } from 'types/swagger';

interface NoteTextFieldProps {
  note: definitions['Note'];
  field: 'title' | 'content';
}

const placeholders = new Map<NoteTextFieldProps['field'], string>([
  ['title', 'Title'],
  ['content', 'Note'],
]);

const transformInput = (e: React.ChangeEvent<HTMLInputElement>) =>
  e.target.value;

const NoteTextField = ({ note, field }: NoteTextFieldProps) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<string | undefined>(note[field]);
  const [fieldModified, setFieldModified] = useState(false);
  const modifyNote = (newValue: string) =>
    void dispatch(
      noteActions.modifyNote({
        noteId: note.id as string,
        note: { [field]: newValue },
      })
    );
  const debouncedModifyNote = useCallback(debounce(modifyNote, 300), []);

  const onChange = flow([
    transformInput,
    over([setValue, fieldModified ? debouncedModifyNote : modifyNote]),
    () => setFieldModified(true),
  ]);

  return (
    <TextField
      multiline
      fullWidth
      value={value}
      onChange={onChange}
      variant="standard"
      placeholder={placeholders.get(field)}
      InputProps={{ disableUnderline: true }}
      inputProps={
        field == 'title' ? { style: { fontWeight: 'bold' } } : undefined
      }
    />
  );
};

export default NoteTextField;

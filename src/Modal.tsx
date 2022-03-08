import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface CustomizedDialogsProps {
  title: string;
  content: string;
  handleClose: () => void;
  open: boolean;
}

const CustomizedDialog = (props: CustomizedDialogsProps) => (
  <>
    <BootstrapDialog
      onClose={props.handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>{props.title}</DialogTitle>
      <DialogContent>{props.content}</DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Close</Button>
      </DialogActions>
    </BootstrapDialog>
  </>
);

export default CustomizedDialog;

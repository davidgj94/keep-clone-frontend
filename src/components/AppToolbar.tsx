import * as React from 'react';

import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArchiveIcon from '@mui/icons-material/Archive';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ClickAwayListener } from '@mui/material';

import { useAppDispatch, useAppSelector } from 'hooks';
import { noteActions } from '#redux/slices';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'black',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

interface AppToolbarProps {
  onMenuIconClick: () => void;
}

const AppToolbar = ({ onMenuIconClick }: AppToolbarProps) => {
  const dispatch = useAppDispatch();
  const selectedNotesIds = useAppSelector((state) => state.notes.selectedNotes);
  const selectMode = selectedNotesIds.length > 0;

  const onCloseSelectMode = () => dispatch(noteActions.resetSelected());

  const onArchiveClick = async () => {
    for (const noteId of selectedNotesIds) {
      await dispatch(
        noteActions.modifyAndInvalidateNote({
          noteId,
          note: { archived: true },
        })
      );
    }
    await dispatch(noteActions.resetSelected());
  };

  return (
    <>
      {!selectMode && (
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onMenuIconClick}
            edge="start"
            sx={{
              marginRight: 5,
            }}
          >
            <MenuIcon htmlColor="black" />
          </IconButton>
          <Typography variant="h6" component="div" color="black">
            Keep
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon htmlColor="black" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex' }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle htmlColor="black" />
            </IconButton>
          </Box>
        </Toolbar>
      )}
      {selectMode && (
        <ClickAwayListener
          onClickAway={onCloseSelectMode}
          disableReactTree={true}
        >
          <Toolbar component="div" onClick={(e: any) => e.stopPropagation()}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={onCloseSelectMode}
              edge="start"
              sx={{
                marginRight: 5,
              }}
            >
              <CloseIcon htmlColor="black" />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex' }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
                onClick={onArchiveClick}
              >
                <ArchiveIcon htmlColor="black" />
              </IconButton>
            </Box>
          </Toolbar>
        </ClickAwayListener>
      )}
    </>
  );
};

export default AppToolbar;

import * as React from 'react';
import { styled, Theme, CSSObject, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import InputBase from '@mui/material/InputBase';
import Modal from '@mui/material/Modal';

import CustomizedDialog from './Modal';
import EnterNote from './EnterNote';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

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

const StyledPaper = styled(Box)(({ theme }) => ({
  maxWidth: theme.spacing(100),
  padding: theme.spacing(3),
  marginRight: 'auto',
  marginLeft: 'auto',
  bgcolor: 'background.paper',
  borderStyle: 'solid',
  borderWidth: '1px',
  ':hover': { boxShadow: theme.shadows[3] },
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const title = 'Keep';
const content = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
dolor purus non enim praesent elementum facilisis leo vel. Risus at
ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
quisque non tellus. Convallis convallis tellus id interdum velit
laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
vivamus at augue. At augue eget arcu dictum varius duis at consectetur
lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
faucibus et molestie ac.`;

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  const toggleDrawer = () => setOpen((prev) => !prev);
  const toggleOpenEdit = () => setOpenEdit((prev) => !prev);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          boxShadow: 0,
          borderBottomWidth: 0.5,
          borderBottomColor: 'black',
          borderBottomStyle: 'solid',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
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
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader></DrawerHeader>
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItemButton
              key={text}
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
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, justifyContent: 'center' }}
      >
        <DrawerHeader />
        <EnterNote />
        {openEdit && (
          <Modal
            open={openEdit}
            onClose={toggleOpenEdit}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StyledPaper>
              <Typography variant="h6" component="h6" color="black">
                {title}
              </Typography>
              {content}
            </StyledPaper>
          </Modal>
        )}
        <StyledPaper
          onClick={toggleOpenEdit}
          sx={{ visibility: !openEdit ? 'visible' : 'hidden' }}
        >
          <Typography variant="h6" component="h6" color="black">
            {title}
          </Typography>
          {content}
        </StyledPaper>
        <StyledPaper>
          <Typography variant="h6" component="h6" color="black">
            {title}
          </Typography>
          {content}
        </StyledPaper>
      </Box>
      {/* <CustomizedDialog
        content={content}
        title={title}
        handleClose={toggleOpenEdit}
        open={openEdit}
      ></CustomizedDialog> */}
    </Box>
  );
}

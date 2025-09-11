import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import LanguageSwitcher from '../LanguageSwitcher';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeContext } from '../../theme/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import Logo from '../../ui-component/Logo2';

/**
 * App bar left section (title/logo).
 * - No fixed width; let Toolpad lay it out.
 * - Clamp logo to a small height so it never overlaps the menu toggle.
 */
export const AppTitleSlot: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minWidth: 0,       // don’t force width
        overflow: 'hidden' // avoid spilling
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          maxHeight: 40,     // 👈 clamp height so 1416×376 never dominates
          overflow: 'hidden',
          '& img, & svg': {
            height: 36,      // render height
            width: 'auto',
            maxWidth: 220,   // and cap width too
          },
        }}
      >
        <Logo />
      </Box>
    </Box>
  );
};

/**
 * App bar center/right actions (left side of avatar).
 * - Theme toggle
 * - Language switcher
 * - Logout (moved here from sidebar footer)
 */
export const ToolbarActionsSlot: React.FC = () => {
  const { mode, toggleColorMode } = useThemeContext();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutTop = () => {
    logout(() => navigate('/')); // go to login/root after logout
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
        <IconButton
          onClick={toggleColorMode}
          color="inherit"
          sx={{ color: 'text.primary', '&:hover': { backgroundColor: 'action.hover' } }}
          aria-label="Toggle theme"
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>

      <LanguageSwitcher />

      {isAuthenticated && (
        <Tooltip title="Logout">
          <IconButton
            onClick={handleLogoutTop}
            color="inherit"
            sx={{ color: 'text.primary', '&:hover': { backgroundColor: 'action.hover' } }}
            aria-label="Logout"
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

/**
 * App bar far-right account avatar & menu.
 */
export const ToolbarAccountSlot: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  if (!isAuthenticated) return null;

  const handleMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => logout(() => navigate('/'));
  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleMenu}
          size="small"
          sx={{ ml: 1 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'gaja.200',
              color: 'gaja.800',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            {user?.name?.[0]?.toUpperCase() || <PersonIcon />}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 2,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            minWidth: 200,
            '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfile}>
          <Avatar /> Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

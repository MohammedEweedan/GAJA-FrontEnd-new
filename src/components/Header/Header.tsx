// src/components/Header/Header.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  useTheme,
  Container,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  Divider,
  Tooltip,
  styled,
  Badge,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Login as LoginIcon,
  Person as PersonIcon,
  MailOutline as MailIcon,
  NotificationsNone as NotificationsIcon,
  AccountCircle,
} from '@mui/icons-material';
import LanguageSwitcher from '../LanguageSwitcher';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeContext } from '../../theme/ThemeProvider';
import Logo from '../../ui-component/Logo';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  backgroundImage: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1, 0),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: 8,
  padding: theme.spacing(0.8, 2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Header: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { mode, toggleColorMode } = useThemeContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isRTL = theme.direction === 'rtl';

  // Menus state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Menu handlers
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  // Desktop account menu
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: isRTL ? 'left' : 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: isRTL ? 'right' : 'left' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      id="primary-search-account-menu"
      keepMounted
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
        {t('header.profile')}
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
        {t('header.settings')}
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <Typography color="error">{t('login.logOut')}</Typography>
      </MenuItem>
    </Menu>
  );

  // Mobile overflow menu
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: isRTL ? 'left' : 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: isRTL ? 'right' : 'left' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      id="primary-search-account-menu-mobile"
      keepMounted
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>{t('header.messages')}</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>{t('header.notifications')}</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label={t('header.accountOfUser')}
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>{t('header.profile')}</p>
      </MenuItem>
    </Menu>
  );

  return (
    <StyledAppBar>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          {/* Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/">
              <Logo />
            </Link>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right side actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Theme Toggle */}
            <Tooltip title={mode === 'dark' ? t('lightMode') || 'Light mode' : t('darkMode') || 'Dark mode'}>
              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                sx={{ color: 'text.primary', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Language */}
            <LanguageSwitcher />

            {/* Mobile overflow trigger (optional) */}
            {isMobile && (
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls="primary-search-account-menu-mobile"
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <Badge variant="dot" color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            )}

            {/* Auth */}
            {isAuthenticated ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenu}
                    size="small"
                    sx={{ ml: 1 }}
                    aria-controls={isMenuOpen ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? 'true' : undefined}
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
              </>
            ) : (
              <StyledButton
                variant="outlined"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: 'gaja.200',
                  color: 'gaja.700',
                  '&:hover': { borderColor: 'gaja.300', backgroundColor: 'gaja.50' },
                }}
              >
                {t('login.signIn')}
              </StyledButton>
            )}
          </Stack>
        </Toolbar>
      </Container>

      {/* Menus */}
      {renderMobileMenu}
      {renderMenu}
    </StyledAppBar>
  );
};

export default Header;

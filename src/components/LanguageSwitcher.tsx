import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { IconButton, Menu, MenuItem, Typography, Box, styled } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useTheme } from '@mui/material/styles';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { language, changeLanguage, isRTL } = useLanguage();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lng: string) => {
    changeLanguage(lng);
    handleClose();
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
  ];

  return (
    <Box>
      <StyledIconButton
        aria-label={t('header.changeLanguage')}
        aria-controls="language-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="large"
        sx={{ ml: 1 }}
      >
        <LanguageIcon />
        <Typography 
          variant="body2" 
          sx={{ 
            ml: 0.5, 
            textTransform: 'uppercase',
            color: 'text.primary'
          }}
        >
          {language}
        </Typography>
      </StyledIconButton>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isRTL ? 'left' : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isRTL ? 'right' : 'left',
        }}
        PaperProps={{
          style: {
            marginTop: theme.spacing(1),
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={language === lang.code}
            sx={{ 
              direction: lang.code === 'ar' ? 'rtl' : 'ltr',
              minWidth: 120,
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              },
            }}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
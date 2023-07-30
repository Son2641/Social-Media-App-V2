import { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setMode, setLogout, setSearchedUsers } from '../../state/index.js';
import { useNavigate } from 'react-router-dom';
import FlexBetween from '../../components/FlexBetween.jsx';
import Friend from '../../components/Friend.jsx';
import WidgetWrapper from '../../components/WidgetWrapper.jsx';

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery('(min-width: 769px)');

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/users/search/${searchQuery}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      dispatch(setSearchedUsers({ searchedUsers: data }));
      setSearchQuery('');
      navigate('/users');
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const [searchTimer, setSearchTimer] = useState(null);

  const performSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/search/${searchQuery}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();

      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  useEffect(() => {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    if (searchQuery.trim() !== '') {
      setSearchResults([]);
      const newSearchTimer = setTimeout(() => {
        performSearch();
      }, 500);
      setSearchTimer(newSearchTimer);
    }

    return () => {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
    };
  }, [searchQuery]);

  console.log('Search Results', searchResults);

  const renderOptionLabel = (results) => {
    return searchResults.map((result) => (
      <WidgetWrapper>
        <Friend
          key={result._id}
          friendId={result._id}
          name={result.fullName}
          userPicturePath={result.picturePath}
        />
      </WidgetWrapper>
    ));
  };

  return (
    <FlexBetween padding='1rem 6%' backgroundColor={alt}>
      <FlexBetween gap='1.75rem'>
        <Typography
          fontWeight='bold'
          fontSize='clamp(1rem, 2rem, 2.25rem)'
          color='primary'
          onClick={() => navigate('/home')}
          sx={{
            '&:hover': {
              color: primaryLight,
              cursor: 'pointer',
            },
          }}
        >
          ConnectHub
        </Typography>

        <FlexBetween borderRadius='15px' gap='0' padding='0.1rem 1.5rem'>
          <Autocomplete
            options={searchResults}
            getOptionLabel={(result) => result.fullName}
            renderOption={renderOptionLabel}
            noOptionsText='No Users Found'
            renderInput={(params) => (
              <TextField
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    '& > fieldset': {
                      border: 'none',
                    },
                  },
                }}
                type='search'
                variant='outlined'
                style={{ width: '300px' }}
                {...params}
                label='Search Users...'
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            )}
          />

          <IconButton onClick={handleSearch}>
            <Search />
          </IconButton>
        </FlexBetween>
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap='2rem'>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === 'dark' ? (
              <DarkMode sx={{ fontSize: '25px' }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: '25px' }} />
            )}
          </IconButton>
          <Message sx={{ fontSize: '25px' }} />
          <Notifications sx={{ fontSize: '25px' }} />
          <Help sx={{ fontSize: '25px' }} />
          <FormControl variant='standard' value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: '150px',
                borderRadius: '0.25rem',
                p: '0.25rem 1rem',
                '& .MuiSvgIcon-root': {
                  pr: '0.25rem',
                  width: '3rem',
                },
                '& .MuiSelect-select:focus': {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position='fixed'
          right='0'
          bottom='0'
          height='100%'
          zIndex='10'
          maxWidth='500px'
          minWidth='300px'
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display='flex' justifyContent='flex-end' p='1rem'>
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius='9px'
            gap='3rem'
            padding='0.1rem 1.5rem'
            margin='1rem'
          ></FlexBetween>
          <FlexBetween
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            gap='3rem'
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: '25px' }}
            >
              {theme.palette.mode === 'dark' ? (
                <DarkMode sx={{ fontSize: '25px' }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: '25px' }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: '25px' }} />
            <Notifications sx={{ fontSize: '25px' }} />
            <Help sx={{ fontSize: '25px' }} />
            <FormControl variant='standard' value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: '150px',
                  borderRadius: '0.25rem',
                  p: '0.25rem 1rem',
                  '& .MuiSvgIcon-root': {
                    pr: '0.25rem',
                    width: '3rem',
                  },
                  '& .MuiSelect-select:focus': {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;

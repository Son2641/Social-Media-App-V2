import { Box, Typography, useTheme } from '@mui/material';
import UserImage from '../../components/UserImage';
import FlexBetween from '../../components/FlexBetween';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    friends,

  } = user;

  return (
  <>
      {/* FIRST ROW */}
      <FlexBetween
        gap='0.5rem'
        onClick={() => {
          navigate(`/profile/${userId}`);
        }}
      >
        <FlexBetween gap='1rem'>
          <UserImage image={picturePath} size={'45px'} />
          <Box>
            <Typography
              variant='h5'
              color={dark}
              fontWeight='350'
            >
              {firstName}  {lastName}    
              <Typography color={medium}>
              {friends && friends.length} friends
            </Typography>
            </Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>
  </>
  );
};
export default UserProfile;

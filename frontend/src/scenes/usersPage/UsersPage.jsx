import Navbar from '../navbar/Navbar';
import { Box, useMediaQuery, Typography } from '@mui/material';
import UserWidget from '../widgets/UserWidget';
import { useDispatch, useSelector } from 'react-redux';
import WidgetWrapper from '../../components/WidgetWrapper';
import Friend from '../../components/Friend';
import AdsWidget from '../widgets/AdsWidget';
import FriendListWidget from '../widgets/FriendListWidget';

const UsersPage = () => {
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const dispatch = useDispatch();
  const searchedUsers = useSelector((state) => state.searchedUsers);
  const { _id, picturePath } = useSelector((state) => state.user);
  return (
    <>
      <Box>
        <Navbar />
        <Box
          width='100%'
          padding='2rem 6%'
          display={isNonMobileScreens ? 'flex' : 'block'}
          gap='0.5rem'
          justifyContent='space-between'
        >
          <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
            <UserWidget userId={_id} picturePath={picturePath} />
          </Box>
          <Box
            flexBasis={isNonMobileScreens ? '42%' : undefined}
            mt={isNonMobileScreens ? undefined : '2rem'}
          >
            {searchedUsers.length === 0 ? (
              <WidgetWrapper>
                <Typography variant='h4'>No users found</Typography>
              </WidgetWrapper>
            ) : (
              searchedUsers.map((user) => (
                <WidgetWrapper marginBottom='1rem' key={user._id}>
                  <Friend
                    friendId={user._id}
                    name={user.fullName}
                    subtitle={user.location}
                    userPicturePath={user.picturePath}
                  />
                </WidgetWrapper>
              ))
            )}
          </Box>
          {isNonMobileScreens && (
            <Box flexBasis='26%'>
              <AdsWidget />
              <Box m='2rem 0' />
              <FriendListWidget userId={_id} />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default UsersPage;

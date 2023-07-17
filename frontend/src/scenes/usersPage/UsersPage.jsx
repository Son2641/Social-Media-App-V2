import Navbar from '../navbar/Navbar';
import { Box, useMediaQuery } from '@mui/material';
import UserWidget from '../widgets/UserWidget';
import { useDispatch, useSelector } from 'react-redux';

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
            {searchedUsers.map((user) => (
              <div key={user._id}>{user.fullName}</div>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UsersPage;

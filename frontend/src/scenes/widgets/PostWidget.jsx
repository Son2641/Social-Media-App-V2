import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from '@mui/icons-material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import Friend from '../../components/Friend';
import WidgetWrapper from '../../components/WidgetWrapper';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPost, setPosts } from '../../state/index.js';
import Comment from '../../components/Comment';
import { useNavigate } from 'react-router-dom';

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  postType,
  origPostUserId,
  origPostName,
  origPostUserPicturePath,
  origPostPicturePath,
  origPostDescription,
  isShared,
  sharedBy,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [isPostDeleted, setIsPostDeleted] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const posts = useSelector((state) => state.posts);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const navigate = useNavigate();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleComment = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/${loggedInUserId}/comment`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: comment }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setComment('');
  };

  const handleDeletePost = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });

    if (response.ok) {
      setIsPostDeleted(true);
      setShowSnackbar(true);
      setOpenDialog(false);
    } else {
      const errorData = await response.json();
      console.error('Delete post failed:', errorData);
    }
  };

  const handleSharePost = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/share`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );

    const data = await response.json();

    dispatch(setPosts({ posts: data }));
    navigate('/home');
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  if (isShared) {
    return (
      <>
        <div>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>{'Delete Post?'}</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                Are you sure you want to delete your post?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleDeletePost} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        {isPostDeleted ? (
          <Snackbar
            open={showSnackbar}
            autoHideDuration={1500}
            onClose={handleSnackbarClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            message='Post is deleted'
          >
            <Alert severity='success'>Post is deleted</Alert>
          </Snackbar>
        ) : (
          <WidgetWrapper m='1rem 0'>
            <Friend
              friendId={postUserId}
              name={name}
              subtitle={location}
              userPicturePath={userPicturePath}
            />
            <WidgetWrapper
              m='1rem 1rem'
              sx={{
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                borderRadius: '1rem',
              }}
            >
              <Friend
                friendId={origPostUserId}
                name={origPostName}
                userPicturePath={origPostUserPicturePath}
              />
              <Typography color={main} sx={{ mt: '1rem' }}>
                {origPostDescription}
              </Typography>
              {origPostPicturePath && (
                <img
                  width='100%'
                  height='auto'
                  alt='post'
                  style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
                  src={`http://localhost:3001/assets/${origPostPicturePath}`}
                />
              )}
            </WidgetWrapper>
            <FlexBetween mt='0.25rem'>
              <FlexBetween gap='1rem'>
                <FlexBetween gap='0.3rem'>
                  <IconButton onClick={patchLike}>
                    {isLiked ? (
                      <FavoriteOutlined sx={{ color: primary }} />
                    ) : (
                      <FavoriteBorderOutlined />
                    )}
                  </IconButton>
                  <Typography>{likeCount}</Typography>
                </FlexBetween>
                <FlexBetween gap='0.3rem'>
                  <IconButton onClick={() => setIsComments(!isComments)}>
                    <ChatBubbleOutlineOutlined />
                  </IconButton>
                  <Typography>{comments.length}</Typography>
                </FlexBetween>
              </FlexBetween>
              <IconButton onClick={handleOpenDialog}>
                <DeleteOutlineIcon />
              </IconButton>
            </FlexBetween>
            {isComments && (
              <Box mt='0.5rem'>
                {comments
                  .slice(0)
                  .reverse()
                  .map((comment, i) => (
                    <Box key={`${name}-${i}`}>
                      <Divider />
                      <Comment
                        userId={comment.userId}
                        comment={comment.comment}
                        postId={postId}
                      />
                    </Box>
                  ))}
                <Divider />
                <FlexBetween>
                  <InputBase
                    placeholder='Write a comment ...'
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    sx={{
                      width: '100%',
                      backgroundColor: palette.neutral.light,
                      borderRadius: '2rem',
                      padding: '1rem 2rem',
                      mt: '1rem',
                    }}
                  />
                  <Button
                    disabled={!comment}
                    onClick={handleComment}
                    sx={{
                      color: palette.background.alt,
                      mt: '1rem',
                      ml: '0.5rem',
                      backgroundColor: palette.primary.main,
                      borderRadius: '3rem',
                      '&:hover': {
                        cursor: 'pointer',
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                      },
                    }}
                  >
                    POST
                  </Button>
                </FlexBetween>
              </Box>
            )}
          </WidgetWrapper>
        )}
      </>
    );
  }

  return (
    <>
      <div>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{'Delete Post?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Are you sure you want to delete your post?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleDeletePost} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {isPostDeleted ? (
        <Snackbar
          open={showSnackbar}
          autoHideDuration={1500}
          onClose={handleSnackbarClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          message='Post is deleted'
        >
          <Alert severity='success'>Post is deleted</Alert>
        </Snackbar>
      ) : (
        <WidgetWrapper m='1rem 0'>
          <Friend
            friendId={postUserId}
            name={name}
            subtitle={location}
            userPicturePath={userPicturePath}
          />
          <Typography color={main} sx={{ mt: '1rem' }}>
            {description}
          </Typography>
          {picturePath && (
            <img
              width='100%'
              height='auto'
              alt='post'
              style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
              src={`http://localhost:3001/assets/${picturePath}`}
            />
          )}
          <FlexBetween mt='0.25rem'>
            <FlexBetween gap='1rem'>
              <FlexBetween gap='0.3rem'>
                <IconButton onClick={patchLike}>
                  {isLiked ? (
                    <FavoriteOutlined sx={{ color: primary }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
                <Typography>{likeCount}</Typography>
              </FlexBetween>
              <FlexBetween gap='0.3rem'>
                <IconButton onClick={() => setIsComments(!isComments)}>
                  <ChatBubbleOutlineOutlined />
                </IconButton>
                <Typography>{comments.length}</Typography>
              </FlexBetween>
            </FlexBetween>
            <FlexBetween gap='0.3rem'>
              <IconButton onClick={handleSharePost}>
                <ShareOutlined />
              </IconButton>
              <Typography>{sharedBy.length}</Typography>
              <IconButton onClick={handleOpenDialog}>
                <DeleteOutlineIcon />
              </IconButton>
            </FlexBetween>
          </FlexBetween>
          {isComments && (
            <Box mt='0.5rem'>
              {comments
                .slice(0)
                .reverse()
                .map((comment, i) => (
                  <Box key={`${name}-${i}`}>
                    <Divider />
                    <Comment
                      userId={comment.userId}
                      comment={comment.comment}
                      postId={postId}
                    />
                  </Box>
                ))}
              <Divider />
              <FlexBetween>
                <InputBase
                  placeholder='Write a comment ...'
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  sx={{
                    width: '100%',
                    backgroundColor: palette.neutral.light,
                    borderRadius: '2rem',
                    padding: '1rem 2rem',
                    mt: '1rem',
                  }}
                />
                <Button
                  disabled={!comment}
                  onClick={handleComment}
                  sx={{
                    color: palette.background.alt,
                    mt: '1rem',
                    ml: '0.5rem',
                    backgroundColor: palette.primary.main,
                    borderRadius: '3rem',
                    '&:hover': {
                      cursor: 'pointer',
                      color: palette.background.alt,
                      backgroundColor: palette.primary.main,
                    },
                  }}
                >
                  POST
                </Button>
              </FlexBetween>
            </Box>
          )}
        </WidgetWrapper>
      )}
    </>
  );
};

export default PostWidget;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../../state/index.js';
import PostWidget from './PostWidget.jsx';

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch('https://connecthub-api.onrender.com/posts', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `https://connecthub-api.onrender.com/posts/${userId}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []);

  return (
    <>
      {posts.length
        ? posts.map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              description,
              location,
              picturePath,
              userPicturePath,
              likes,
              comments,
              origPostUserId,
              origPostFirstName,
              origPostLastName,
              origPostUserPicturePath,
              origPostPicturePath,
              origPostDescription,
              postType,
              sharedBy,
            }) =>
              postType === 'Normal' || postType === null ? (
                <PostWidget
                  key={_id}
                  postId={_id}
                  postUserId={userId}
                  name={`${firstName} ${lastName}`}
                  description={description}
                  location={location}
                  picturePath={picturePath}
                  userPicturePath={userPicturePath}
                  likes={likes}
                  comments={comments}
                  postType={postType}
                  sharedBy={sharedBy}
                />
              ) : postType === 'Shared' ? (
                <PostWidget
                  key={_id}
                  postId={_id}
                  postUserId={userId}
                  name={`${firstName} ${lastName}`}
                  description={description}
                  location={location}
                  picturePath={picturePath}
                  userPicturePath={userPicturePath}
                  likes={likes}
                  comments={comments}
                  postType={postType}
                  origPostUserId={origPostUserId}
                  origPostName={`${origPostFirstName} ${origPostLastName}`}
                  origPostUserPicturePath={origPostUserPicturePath}
                  origPostPicturePath={origPostPicturePath}
                  origPostDescription={origPostDescription}
                  isShared={true}
                  sharedBy={sharedBy}
                />
              ) : null
          )
        : null}
    </>
  );
};

export default PostsWidget;

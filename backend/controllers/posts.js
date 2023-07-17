import Post from '../models/Post.js';
import User from '../models/User.js';

// Create
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find({ deleted: { $ne: true } }).sort({
      createdAt: -1,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Read
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find({ deleted: { $ne: true } }).sort({
      createdAt: -1,
    });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId, deleted: { $ne: true } }).sort({
      createdAt: -1,
    });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const postComment = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    const { comment } = req.body;
    const newComment = {
      userId,
      comment,
    };
    const post = await Post.findById(postId);
    post.comments.push(newComment);
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { comments: post.comments },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const post = await Post.findById(postId);
    const updatedPost = post.comments.filter((item, i) => {
      return item.comment !== comment;
    });
    const updatedNewPost = await Post.findByIdAndUpdate(
      postId,
      { comments: updatedPost },
      { new: true }
    );
    res.status(200).json(updatedNewPost);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Delete
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    post.deleted = true;
    post.deletedAt = new Date();
    await post.save();

    res.status(204).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

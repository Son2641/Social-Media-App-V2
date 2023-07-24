import { Schema, model, Types } from 'mongoose';

const PostSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
    sharedFrom: {
      type: String,
    },
    sharedBy: {
      type: Array,
      default: [],
    },
    origPostFirstName: {
      type: String,
    },
    origPostLastName: {
      type: String,
    },
    origPostUserPicturePath: {
      type: String,
    },
    origPostLikes: {
      type: Map,
      of: Boolean,
    },
    origPostComments: {
      type: Array,
    },
    postType: {
      type: String,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Post = model('Post', PostSchema);

export default Post;

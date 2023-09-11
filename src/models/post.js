const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    text: String,
    level: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    comments: [
      {
        text: String,
        user_image: {
          type: String,
          required: true,
        },
        user_name: {
          type: String,
          required: true,
        },
        user_email: {
          type: String,
          required: true,
        },
        _id:undefined,
        replies: [
          {
            text: String,
            user_image: {
              type: String,
              required: true,
            },
            user_name: {
              type: String,
              required: true,
            },
            user_email: {
              type: String,
              required: true,
            },
            _id:undefined
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;

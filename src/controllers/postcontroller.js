const Post = require("../models/post");
const { isEmailAdmin } = require("../utils/staticEmail.js");
const fs = require("fs");
const path = require("path");
module.exports.create = async (req, res) => {
  try {
    let body = req.body;

    const new_post = new Post({
      user_name: body.decoded.name,
      user_email: body.decoded.email,
      text: body.text,
      level: body.decoded.level,
      image: req.file?.path !== undefined ? req.file.path : "",
      comments: [],
    });
    new_post.save().then(async (response) => {
      if (response) {
        return res.json({
          Success: true,
          message: `post ( ${response.user_name} ) Created`,
          data: response,
        });
      } else return res.json({ Success: false, message: "Creation Failed" });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.comment = async (req, res) => {
  try {
    let body = req.body;

    const new_comment = {
      user_name: body.decoded.name,
      user_email: body.decoded.email,
      text: body.text,
      time: Date.now(),
    };
    Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: new_comment } },
      { new: true }
    ).then(async (response) => {
      if (response) {
        return res.json({
          Success: true,
          message: `comment ( ${new_comment.user_name} ) Created`,
          data: response.comments[response.comments.length - 1],
        });
      } else return res.json({ Success: false, message: "Creation Failed" });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.all = async (req, res) => {
  try {
    Post.find().then(async (response) => {
      return res.json({ Success: true, response });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.by_level = async (req, res) => {
  try {
    Post.find({ level: req.params.level }).then(async (response) => {
      return res.json({ Success: true, response });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.myposts = async (req, res) => {
  try {
    Post.find({ user_email: req.body.decoded.email }).then(async (response) => {
      return res.json({ Success: true, response });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};
module.exports.deleteone = async (req, res) => {
  try {
    if (req.body.decoded.admin && req.body.decoded.email === isEmailAdmin()) {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res
          .status(404)
          .json({ Success: false, message: "Post not found" });
      }

      if (post.image) {
        try {
          const imagePath = path.join(__dirname, "..", post.image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (err) {
          console.error("Error deleting image:", err.message);
        }
      }
      Post.deleteOne({ _id: req.params.id }).then(async (response) => {
        return res.json({ Success: true, message: "Deleted" });
      });
    } else {
      return res.json({ Success: false, message: "INVALID AUTH" });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({ Success: false, message: "SOME ERROR OCCURED" });
  }
};

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminpostSchema = new Schema(
  {

    text: String,

    link: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Adminpost = mongoose.model("Adminpost", adminpostSchema);
module.exports = Adminpost;

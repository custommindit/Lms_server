const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const announcementSchema = new Schema(
  {
    name: String,
    day:String,
    startAt:String,
    endAt:String,
    level:Number
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;

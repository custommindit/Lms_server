const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fakeviews = new Schema(
  {
    unit_id:String,
    fake_number: Number,
  },
  { timestamps: true }
);

const FakeViews = mongoose.model("FakeViews", fakeviews);
module.exports = FakeViews;

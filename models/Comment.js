const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    comment: { type: String, maxLength: 200 },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Comment", commentSchema);

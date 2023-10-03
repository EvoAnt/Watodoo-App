const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    name: String,
    location: String,
    description: String,
    imageUrl: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Post", postSchema);
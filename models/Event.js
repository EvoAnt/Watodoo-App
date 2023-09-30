const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
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

module.exports = model("Event", eventSchema);
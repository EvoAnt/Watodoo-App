const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: String,
    password: String,
    fullName: String,
    userName: String,
    profileImage: String,
    bio: String,
    savedEvents: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);

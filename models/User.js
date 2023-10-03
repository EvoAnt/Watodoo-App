const { Schema, model, SchemaType } = require('mongoose');

const userSchema = new Schema(
    {
      email: String,
      password: String,
      fullName: String,
      userName: String,
      profileImage: String,
      bio: String,
    savedEvents: [{type: Schema.Types.ObjectId, ref: "Event"}]
    },
    {
      timestamps: true
    }
  );

  module.exports = model('User', userSchema);
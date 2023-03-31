import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = mongoose.Schema({
  username: String,
  nickname: String,
  password: String,
  alerts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Alert'
  }
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User',userSchema);

export default User;
import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  address: String,
  password: String,
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User',userSchema);

export default User;
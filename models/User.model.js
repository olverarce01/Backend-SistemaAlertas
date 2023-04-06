import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  address: String,
  password: String,
});

const User = mongoose.model('User',userSchema);

export default User;
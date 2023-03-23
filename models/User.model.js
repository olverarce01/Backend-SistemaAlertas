import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  alerts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Alerta'
  }
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User',userSchema);

export default User;
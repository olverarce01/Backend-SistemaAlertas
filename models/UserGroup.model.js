import mongoose from "mongoose";

const userGroupSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  admin: {
    type: Boolean,
    default: false
  },
  blocked: {
    type: Boolean,
    default: false
  }
  
});
const UserGroup = mongoose.model('UserGroup',userGroupSchema);

export default UserGroup;
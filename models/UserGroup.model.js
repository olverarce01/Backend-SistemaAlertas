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
  admin: Boolean
  
});
const UserGroup = mongoose.model('UserGroup',userGroupSchema);

export default UserGroup;
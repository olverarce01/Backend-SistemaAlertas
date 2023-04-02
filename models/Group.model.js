import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    unique: true
  }
});
const Group = mongoose.model('Group',groupSchema);

export default Group;
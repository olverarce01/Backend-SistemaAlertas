import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
  groupName: String
});
const Group = mongoose.model('Group',groupSchema);

export default Group;
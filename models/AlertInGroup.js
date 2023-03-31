import mongoose from "mongoose";

const alertInGroupSchema = mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  alert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alert'
  }
});

const AlertInGroup = mongoose.model('AlertInGroup', alertInGroupSchema);

export default AlertInGroup;
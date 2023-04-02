import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true
}

);

const Alert = new mongoose.model('Alert', alertSchema);

export default Alert;
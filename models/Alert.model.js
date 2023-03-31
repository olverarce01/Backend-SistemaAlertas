import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  title: String,
  body: String,
  icon: String
},
{
  timestamps: true
}

);

const Alert = new mongoose.model('Alert', alertSchema);

export default Alert;
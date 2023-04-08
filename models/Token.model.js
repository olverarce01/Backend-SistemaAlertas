import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: String
});

const Token = new mongoose.model('Token', tokenSchema);

export default Token;
import mongoose from "mongoose";

const alertaSchema = mongoose.Schema({
  title: String,
  body: String,
  icon: String
});

const Alerta = mongoose.model('Alert', alertaSchema);

export default Alerta;
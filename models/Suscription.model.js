import mongoose from "mongoose";

const suscriptionchema = new mongoose.Schema({
  endpoint: {
    type: String
  },
  expirationTime: {
    type: mongoose.Schema.Types.Mixed
  },
  keys: {
    p256dh: {
      type: String,
      unique: true
    },
    auth: {
      type: String,
      unique: true
    }
  }
}
);

const Suscription = new mongoose.model('Suscription', suscriptionchema);

export default Suscription;
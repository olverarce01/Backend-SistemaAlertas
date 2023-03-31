import Alert from '../models/Alert.model.js';
import User from '../models/User.model.js';

const getAlerts = async (req,res) => {
  if(!req.user){
    res.send('loggin first');
  }else{
    const alerts = await Alert.find({});
    res.send(alerts);  
  }
}

const getMyAlerts = async (req,res) =>{
  if(!req.user){
    res.send('loggin first');
  }else{
    const alerts = await Promise.all(req.user.alerts.map(alertId => {
      return Alert.find({_id:alertId});
    }));
    await User.updateOne({_id:req.user._id},{alerts: []});
    res.send(alerts);
  }
}
const postAlert = async (req,res) => {
  const alerta = new Alert ({
  title: req.body.title,
  body: req.body.body,
  icon: req.body.icon
  });
  alerta.save();

  const result = await User.updateMany({},{$push: {alerts: alerta}})
  if(result){
    res.send('alerta guardada');
  }
}

export {getAlerts, postAlert, getMyAlerts};
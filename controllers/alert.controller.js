import Alert from '../models/Alert.model.js';
import AlertInGroup from '../models/AlertInGroup.js';
import Group from '../models/Group.model.js';
import User from '../models/User.model.js';
import UserGroup from '../models/UserGroup.model.js';

const getMyAlertsInGroup = async (req,res) =>{
  if(!req.user){
    res.send('loggin first');
  }else{
    const idGroup = new mongoose.Types.ObjectId(req.params.id);

    const group = Group.findOne({_id: idGroup});
    const AlertsInGroup = AlertInGroup.aggregate(
    [
      {$match: {group: idGroup}},
      {
        $lookup:
        {
          from: 'alerts',
          localField: 'alert',
          foreignField: '_id',
          as: 'dataAlert'
        }
      },        
      {$unwind: '$dataAlert'}
    ]
    )
    const results = await Promise.all([group, AlertsInGroup]);

    const data = {
      "group": results[0],
      "alerts": await Promise.all(results[1].map(async(alertsInGroup)=>{
        const sender = User.findOne({_id: alertsInGroup.dataAlert.user})
        return {...alertsInGroup, sender};
      }))
    }
    res.send(data);
  }
}

const postAlert = async (req,res) => {
  if(req.user){
    const alert = new Alert ({
      sender: req.user._id,
    });
    alert.save();

    const myGroups = await UserGroup.find({user: req.user._id});

    myGroups.forEach(userGroup => {
      let alertInGroup = new AlertInGroup({
        group: userGroup._id,
        alert: alert._id
      });
      alertInGroup.save()   
      //conectar con firebase realtime     
    });
    
    if(result){
      res.send('alerta guardada');
    }
    
  }else{
    res.send('user not logged still')
  }
}

export {postAlert, getMyAlertsInGroup};
import { ref, set } from 'firebase/database';
import database from '../firebase.js';
import Alert from '../models/Alert.model.js';
import AlertInGroup from '../models/AlertInGroup.js';
import Group from '../models/Group.model.js';
import User from '../models/User.model.js';
import UserGroup from '../models/UserGroup.model.js';
import mongoose from 'mongoose';

const getMyAlerts = async (req,res)=>{
  if(!req.user){
    res.json({message: "loggin first"})
  }else{
    const alerts = await Alert.find({});
    res.json(alerts);
  }
};

const getMyAlertsInGroup = async (req,res) =>{
  if(!req.user){
    res.json({message: "loggin first"});
  }else{
    const idGroup = new mongoose.Types.ObjectId(req.params.id);

    const AlertsInGroup = await AlertInGroup.aggregate(
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
    if(AlertsInGroup){
      const result = await Promise.all(AlertsInGroup.map(async(alert)=>{
        const sender = await User.findOne({_id:alert.dataAlert.sender});
        return {
          sender,
          _id :alert._id,
          alert:alert.alert,
          createdAt:alert.dataAlert.createdAt,
          updatedAt:alert.dataAlert.updatedAt
        };
      }))
      res.json(result);
    }else{
      res.json({message: "not found alerts in group"})
    }
  }
}

const postAlert = async (req,res) => {
  if(req.user){
    const alert = new Alert ({
      sender: req.user._id,
    });
    await alert.save();
    const db = database;
    set(ref(db,'alerts/' + alert._id.toString()),{
      sender: req.user._id.toString(),
      name: req.user.name,
      address: req.user.address,
      username: req.user.username,
      createdAt: alert.createdAt.toString(),
    });
    res.json({message: "alerta guardada"});    
  }else{
    res.json({message: "user not logged still"})
  }
}
// const postAlert = async (req,res) => {
//   if(req.user){
//     const alert = new Alert ({
//       sender: req.user._id,
//     });
//     alert.save();

//     const myGroups = await Promise.resolve(UserGroup.find({user: req.user._id, blocked: false}));

//     Promise.all(myGroups.map(async (userGroup) => {
//       let alertInGroup = new AlertInGroup({
//         group: userGroup.group,
//         alert: alert._id
//       });
//       alertInGroup.save()
//     }));
    
//     res.send('alerta guardada');    
//   }else{
//     res.send('user not logged still')
//   }
// }

export {postAlert, getMyAlertsInGroup, getMyAlerts};
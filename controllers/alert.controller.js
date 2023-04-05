import Alert from '../models/Alert.model.js';
import AlertInGroup from '../models/AlertInGroup.js';
import Group from '../models/Group.model.js';
import Suscription from '../models/Suscription.model.js';
import User from '../models/User.model.js';
import UserGroup from '../models/UserGroup.model.js';
import mongoose from 'mongoose';

const getMyAlertsInGroup = async (req,res) =>{
  if(!req.user){
    res.send('loggin first');
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
          "_id ":alert._id,
          "alert":alert.alert,
          "createdAt":alert.dataAlert.createdAt,
          "updatedAt":alert.dataAlert.updatedAt
        };
      }))
      res.send(result);
    }else{
      res.send('not found alerts in group')
    }
  }
}

const postAlert = async (req,res) => {
  if(req.user){
    const alert = new Alert ({
      sender: req.user._id,
    });
    alert.save();

    const myGroups = await Promise.resolve(UserGroup.find({user: req.user._id, blocked: false}));

    Promise.all(myGroups.map(async (userGroup) => {
      let alertInGroup = new AlertInGroup({
        group: userGroup.group,
        alert: alert._id
      });
      alertInGroup.save()

      res.status(200).json();
      const pushSubscription = await Promise.resolve(Suscription.find({}));
      if(pushSubscription){
        pushSubscription.forEach(suscription=>{
          const payload = JSON.stringify({
            title: 'My custom notification',
            body: 'Hello world',
          });
          try{
            Promise.resolve(webpush.sendNotification(suscription,payload));
          }catch(error){
            console.log(error);
          }    
        })
      }
    }));
    
    res.send('alerta guardada');    
  }else{
    res.send('user not logged still')
  }
}

export {postAlert, getMyAlertsInGroup};
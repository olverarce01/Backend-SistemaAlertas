import Alert from '../models/Alert.model.js';
import AlertInGroup from '../models/AlertInGroup.js';
import Group from '../models/Group.model.js';
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

    const myGroups = await UserGroup.find({user: req.user._id, blocked: false});

    myGroups.forEach(userGroup => {
      let alertInGroup = new AlertInGroup({
        group: userGroup.group,
        alert: alert._id
      });
      alertInGroup.save()   
      //conectar con firebase realtime     
      /*
      const integrants = await UserGroup.find({group: userGroup._id})
      integrants.foreach(integrant =>{
        const obj = {
          "user": integrant.user
        }
        database.ref("alertar").set(obj, function(error){
          if(error){
            console.log("Failed with error: "+ error)
          }else{
            console.log("success")
          }
        })
      })
      */
    });
    
    res.send('alerta guardada');
    
    
  }else{
    res.send('user not logged still')
  }
}

export {postAlert, getMyAlertsInGroup};
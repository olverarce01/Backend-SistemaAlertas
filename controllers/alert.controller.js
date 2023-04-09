import Alert from '../models/Alert.model.js';
import AlertInGroup from '../models/AlertInGroup.js';
import User from '../models/User.model.js';
import mongoose from 'mongoose';
import admin from '../admin.js';
import Token from '../models/Token.model.js';
import asyncHandler from 'express-async-handler';


const getMyAlerts = async (req,res)=>{
  if(!req.user){
    res.status(400).send({ error: "loggin first" });
  }else{
    const alerts = await Alert.find({});
    res.json(alerts);
  }
};

const getMyAlertsInGroup = async (req,res) =>{
  if(!req.user){
    res.status(400).send({ error: "loggin first" });
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

const postAlert = asyncHandler(async (req,res) => {
  if(req.user){
    const alert = new Alert ({
      sender: req.user._id,
    });
    alert.save();

    const tokens = await Token.find({});

    const tokensArr = tokens.map((token)=>{return token.token;})
    admin.messaging().sendMulticast({
      tokens: tokensArr,
      notification: {
        title: 'new alert',
        body: 'alert'
      },
      data:{
        messageID: alert._id.toString(),
        messageTimestamp: alert.createdAt.toString()
      }
    })
    .then((response)=>{
      console.log(JSON.stringify(response));
      if(response.failureCount >0){
        const failedTokens = [];
        response.responses.forEach((resp, idx)=>{
          if(!resp.success){
            failedTokens.push(tokensArr[idx]);
          }
        });
        console.log('list tokens failure: '+failedTokens);

      }
    })
    res.json({message: "alerta guardada"});    
  }else{
    res.status(400).send({ error: "user not logged still" });
  }
})
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
import Alert from '../models/Alert.model.js';
import AlertInGroup from '../models/AlertInGroup.js';
import Group from '../models/Group.model.js';
import User from '../models/User.model.js';
import UserGroup from '../models/UserGroup.model.js';
import mongoose from 'mongoose';
import admin from 'firebase-admin';


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

const postAlert = async (req,res) => {
  if(req.user){
    const alert = new Alert ({
      sender: req.user._id,
    });
    await alert.save();

    admin.initializeApp({
      credential: admin.credential.cert({        
        "type": "service_account",
        "project_id": "vigilant-12535",
        "private_key_id": process.env.Private_key_id,
        "private_key": process.env.Private_key ? process.env.private_key.replace(/\\n/gm, "\n"):undefined,
        "client_email": "firebase-adminsdk-v6l96@vigilant-12535.iam.gserviceaccount.com",
        "client_id": "106643052260083512683",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-v6l96%40vigilant-12535.iam.gserviceaccount.com"
      })
    });
    try {
      await admin.messaging().sendMulticast({
        tokens,
        notification:{
          sender,
          alert
        }
      });
      res.json({message: "alerta guardada"});    
    }catch(err){
      res.status(err.status || 500)
      .json({message: err.message|| "something went wrong!"});
    }
  }else{
    res.status(400).send({ error: "user not logged still" });
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
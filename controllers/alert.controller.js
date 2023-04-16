import admin from '../admin.js';
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import middlewareUrl from '../middleware.js';

const getMyAlerts = async (req,res)=>{
  if(!req.user){
    res.status(400).send({ error: "loggin first" });
  }else{

    const {data:alerts} = await axios({
      method: 'get',
      url: middlewareUrl+'/alerts/',
    });
    console.log(alerts);
    res.json(alerts);
  }
};

const postAlert = asyncHandler(async (req,res) => {
  if(req.user){
    const {data:alert} = await axios({
      method: 'post',
      url: middlewareUrl+'/alerts/save',
      data: {
        senderId: req.user._id
      }
    })

    const {data:tokens} = await axios({
      method: 'get',
      url: middlewareUrl+'/tokens/'
    });

    const tokensArr = tokens.map((token)=>{return token.token;})
    admin.messaging().sendMulticast({
      tokens: tokensArr,
      notification: {
        title: 'Nueva alerta de: '+req.user.name,
        body: 'Su dirección es: '+req.user.address
      },
      data:{
        messageID: alert._id.toString(),
        messageTimestamp: alert.createdAt.toString()
      }
    })
    .then((response)=>{
      //console.log(JSON.stringify(response));
      if(response.failureCount >0){
        const failedTokens = [];
        response.responses.forEach((resp, idx)=>{
          if(!resp.success){
            failedTokens.push(tokensArr[idx]);
          }
        });
        //console.log('list tokens failure: '+failedTokens);

      }
    })
    res.json({message: "alerta guardada"});    
  }else{
    res.status(400).send({ error: "user not logged still" });
  }
})

export {postAlert, getMyAlerts};
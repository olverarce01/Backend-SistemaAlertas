import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import middlewareUrl from '../middleware.js';

const getUser = async (req, res) => {

  const {data:user} = await axios({
    method: 'post',
    url: middlewareUrl+'/users/one',
    data: {
      id: req.params.id
    }
  })
  res.json(user);
}

const getCurrentUser = async (req, res) => {

  const {data:user} = await axios({
    method: 'post',
    url: middlewareUrl+'/users/one',
    data: {
      id: req.user._id
    }
  });
  res.json(user);
}

const protect = asyncHandler(async(req,res,next)=>{
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try{
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token,process.env.JWT_SECRET)


      const {data:reqUser} = await axios({
        method: 'post',
        url: middlewareUrl+'/users/byId',
        data: {
          id: decoded.id         
        }
      })      
      req.user=reqUser;
      
      next();
    }catch(error){
      res.status(400).send({ error: "invalid token" });
    }
    if(!token){
      res.status(400).send({ error: "no authorization no token" });
    }
  }
})

export {getUser, getCurrentUser, protect};
import User from "../models/User.model.js";
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const getUser = async (req, res) => {
  const user = await User.find({_id: req.params.id});
  res.send(user);
}

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({_id: req.user.id});
  res.json(user);
}

const protect = asyncHandler(async(req,res,next)=>{
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try{
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token,process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next();
    }catch(error){
      res.send('invalid token')
    }
    if(!token){
      res.send('no authorization no token')	
    }
  }
})

export {getUser, getCurrentUser, protect};
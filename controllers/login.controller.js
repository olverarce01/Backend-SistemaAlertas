import User from "../models/User.model.js";
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const postRegister = asyncHandler(async(req, res) => {
  const {username, password, address, name} = req.body;

  if(!username || !password || !address ||!name){
    res.send('faltan datos')
  }else{
    const userExist = await User.findOne({username})
    if(userExist){
      res.send('ya esta registrado')
    }else{
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)
      const user = await User({
        username: username,
        name: name,
        address: address,
        password: hashedPassword
      });
      user.save()
      res.json({
      _id: user.id,
      name: user.name,
      username: user.username,
      token: generateToken(user._id)
      })   
    }
  }
  
})

const postLogin = asyncHandler(async (req,res) =>{
    const {username, password} = req.body;
    const user = await User.findOne({username})
    if(user && (await bcrypt.compare(password,user.password))){
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        address: user.address,
        token: generateToken(user._id)
      });
    }else{
      res.send('invalid credentials')
    }
})

const generateToken = (id) =>{
  return jwt.sign({id},process.env.JWT_SECRET,{
      expiresIn:'30d'
  })
}

export {postLogin, postRegister};
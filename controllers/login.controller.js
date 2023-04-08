import User from "../models/User.model.js";
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Token from "../models/Token.model.js";

const postRegister = asyncHandler(async(req, res) => {
  const {username, password, address, name, token} = req.body;

  if(!username || !password || !address ||!name ||!token){
    let datosFaltantes = [];
    if(!username){datosFaltantes.push('username')}
    if(!password){datosFaltantes.push('password')}
    if(!address){datosFaltantes.push('address')}
    if(!name){datosFaltantes.push('name')}
    if(!token){datosFaltantes.push('token')}


    res.status(400).send({ error: "faltan datos", datosFaltantes: datosFaltantes});
  }else{
    const userExist = await User.findOne({username})
    if(userExist){
      res.status(400).send({ error: "ya esta registrado" });
    }else{
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)
      const user = await User({
        username: username,
        name: name,
        address: address,
        password: hashedPassword
      });
      user.save();

      console.log('token recibido: '+token)
      let myToken = new Token({
        token: token
      })
      myToken.save();
      
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
      res.status(400).send({ error: "invalid credentials" });
    }
})

const generateToken = (id) =>{
  return jwt.sign({id},process.env.JWT_SECRET,{
      expiresIn:'30d'
  })
}

export {postLogin, postRegister};
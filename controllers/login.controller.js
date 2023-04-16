import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
const postRegister = asyncHandler(async(req, res) => {
  const {username, password, address, name} = req.body;

  if(!username || !password || !address ||!name){
    let datosFaltantes = [];
    if(!username){datosFaltantes.push('username')}
    if(!password){datosFaltantes.push('password')}
    if(!address){datosFaltantes.push('address')}
    if(!name){datosFaltantes.push('name')}


    res.status(400).send({ error: "faltan datos", datosFaltantes: datosFaltantes});
  }else{
     const {data:userExist} = await axios(
      {
        method: 'post',
        url: 'http://localhost:4001/users/one/byUsername',
        data: {
          username: username
        }
      }
    );
    if(userExist){
      res.status(400).send({ error: "ya esta registrado" });
    }else{
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)

      const {data:user} = await axios({
        method: 'post',
        url: 'http://localhost:4001/users/save',
        data: {
          username: username,
          name: name,
          address: address,
          password: hashedPassword
        }
      })      
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

    const {data:user} = await axios({
      method: 'post',
      url: 'http://localhost:4001/users/one/byUsername',
      data:{
        username: username,     
      }
    })

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
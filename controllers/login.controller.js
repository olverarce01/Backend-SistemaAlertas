import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import middlewareUrl from '../middleware.js';
const postRegister = asyncHandler(async(req, res) => {
  const {username, password, address, name} = req.body;
  
  const {data:userExist} = await axios(
    {
      method: 'post',
      url: middlewareUrl+'/users/one/byUsername',
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
      url: middlewareUrl+'/users/save',
      data: {
        username: username,
        name: name,
        address: address,
        password: hashedPassword
      }
    })      
    res.json({message: "usuario agregado"})   
  }
  
  
})

export {postRegister};
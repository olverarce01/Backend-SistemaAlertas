import User from "../models/User.model.js";

const getUsers = async (req,res) =>{
  const users = await User.find({});
  res.send(users)
}

const postUser = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  user.save();
  res.send('usuario guardado');
}

const getUser = async (req, res) => {
  const user = await User.find({_id: req.params.id});
  res.send(user);
}

const getCurrentUser = (req, res) => {
  if(req.user){
    res.send(req.user);
  }else{
    res.send('none user still');
  }
}

export {getUsers, postUser, getUser, getCurrentUser};
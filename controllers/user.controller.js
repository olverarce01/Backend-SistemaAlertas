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

export {getUsers, postUser, getUser};
import User from "../models/User.model.js";


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

export {getUser, getCurrentUser};
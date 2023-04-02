import User from "../models/User.model.js";
import passport from "passport";


const postRegister = (req, res) => {
  const {username, password, address, name} = req.body;

  User.register({username: username, address: address, name:name}, password,function(err, user){
    if(err){res.send(err)}
    else
    {res.send('registered');}
  });
  
}

const postLogin = (req,res) =>{
    const {username, password} = req.body;

    const user = new User({
      username: username,
      password: password
    });
    req.login(user, function(err){
      if(err){console.log(err)}else{
        passport.authenticate('local', { failureRedirect: '/error' })(req,res, function(){            
            res.send('logged');
        });
      }
    });
}

const getLogout = async (req,res) =>{
  await req.logout(function(err) {
    if (err) { return next(err); }
    res.send('outlogged');
  });
}

export {postLogin, getLogout, postRegister};
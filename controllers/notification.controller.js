import Token from "../models/Token.model.js";

const postSaveToken = async (req, res) =>{
  const {token } = req.body;

  const existToken = new Token.find({token: token});
  if(existToken){
    res.status(400).json({message: 'ya esta el token'});
  }else{
    let myToken = new Token({
      token: token
    })
    myToken.save();
    res.status(200).json({message: 'token saved'});  
  }
}
export {postSaveToken};
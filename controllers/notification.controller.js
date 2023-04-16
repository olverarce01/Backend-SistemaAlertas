import axios from 'axios';


const postSaveToken = async (req, res) =>{
  const {token } = req.body;

  const {data:existToken} = await axios({
    method: 'get',
    url: 'http://localhost:4001/tokens/one/'+token
  })

  if(existToken){
    res.status(400).json({message: 'ya esta el token'});
  }else{

    const {data:result} = await axios({
      method: 'post',
      url: 'http://localhost:4001/tokens/save',
      data: {
        token: token
      }
    })
    if(result){
      res.status(200).json({message: 'token saved'});  
    }else{
      res.status(400).json({message: 'token not saved'});  
    }
  }
}
export {postSaveToken};
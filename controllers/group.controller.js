import Group from "../models/Group.model.js";
import UserGroup from "../models/UserGroup.model.js";

const postGroup = async (req,res) =>{
  const {groupName} = req.body;
  const group = new Group({
    groupName: groupName
  });
  const result = await group.save();
  if(result){
    const userGroup = new UserGroup({
      user: req.user._id,
      group: group._id,
      admin: true
    });
    userGroup.save();
  
    res.send('group saved');      
  }else{
    res.send('group no saved');
  }
}

const postJoinGroup = async (req, res) => {
  if(!req.user){
    res.send('loggin first');
  }else{
    const {code} = req.body;
    const group = await Group.findOne({_id:code});
    if(group){
      const userGroup = new UserGroup({
        user: req.user._id,
        group: group._id,
        admin: false
      });
      userGroup.save();
    
      res.send('user added');      
    }else{
      res.send('not found group');
    }  
  }
}

const getNumIntegrants = async (id) =>{
  const result = await UserGroup.aggregate(
    [
      { $match : { group : id } },
      { $count : "integrants"},
    ]
    );
  console.log(result[0].integrants);
  return result[0].integrants;
}

const getMyGroups = async (req, res) => {
  if(!req.user){
    res.send('loggin first');
  }else{
    const result = await UserGroup.aggregate(
      [
        { $match : { user : req.user._id } },
        {
          $lookup:
          {
            from: 'groups',
            localField: 'group',
            foreignField: '_id',
            as: 'dataGroup'
          }
        },
        {$unwind: '$dataGroup'}
      ]
    );
    const finalResult = await Promise.all(result.map(async(userGroup)=>{
      return {
        integrants: await getNumIntegrants(userGroup.dataGroup._id), 
        groupname: userGroup.dataGroup.groupName, 
        admin: userGroup.admin
      };          
    }));
    res.send(finalResult);  
  }
}

const getMyGroup = async (req, res) => {
  
}

export {postGroup, postJoinGroup, getMyGroups, getMyGroup};
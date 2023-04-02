import mongoose from "mongoose";
import Group from "../models/Group.model.js";
import UserGroup from "../models/UserGroup.model.js";
import AlertInGroup from "../models/AlertInGroup.js";

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
        admin: userGroup.admin,
        blocked: userGroup.blocked,
        _id: userGroup.dataGroup._id
      };          
    }));
    res.send(finalResult);  
  }
}

const getMyGroup = async (req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  const integrants = UserGroup.aggregate(
    [
      { $match : { group :  id} },
      {
        $lookup:
        {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'dataUser'
        }
      }
    ]
  );
  const group = Group.findOne({_id: req.params.id});
  const results = await Promise.all([integrants,group]);
  
  const data = {
    "integrants" : results[0].map(integrant =>{
      return {"_id": integrant.dataUser[0]._id,
              "admin": integrant.admin,
              "blocked": integrant.blocked,
              "name" : integrant.dataUser[0].name,
              "address" : integrant.dataUser[0].address,
              "username" : integrant.dataUser[0].username,
            };
    }),
    "groupName" : results[1]
  }
  res.send(data);
}

const postDeleteGroup = async (req,res) =>{
  const id = req.body.id;
  const deleteGroup = Group.deleteOne({_id: id})
  const deleteUserGroup = UserGroup.deleteMany({group: id});
  const deleteAlertGroup = AlertInGroup.deleteMany({group: id});
  const results = await Promise.all([deleteGroup,deleteUserGroup,deleteAlertGroup])
  if(results[0] && results[1] && results[2]){
    res.send('deleted group')
  }else{
    res.send('no deleted group');
  }
}

const postRenameGroup = async (req, res) =>{
  const {id, newname} = req.body;
  const result = await Group.updateOne({_id: id},{groupName: newname});
  if(result){
    res.send('updated name')
  }else{
    res.send('no updated name')
  }
}

const postBlockUserInGroup = async (req, res) => {
  const {user, group} = req.body;
  const result = await UserGroup.updateOne({user: user, group: group},{blocked: true});
  if(result){
    res.send('blocked user in this group');
  }else{
    res.send('not blocked user in this group');
  }
}

export {postGroup, postJoinGroup, getMyGroups, getMyGroup, postDeleteGroup, postRenameGroup, postBlockUserInGroup};
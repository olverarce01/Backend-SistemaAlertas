import * as dotenv from 'dotenv'
dotenv.config()

import ejs from 'ejs'
import mongoose from "mongoose";
import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import webpush from 'web-push';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {getMyAlertsInGroup, postAlert } from "./controllers/alert.controller.js";
import { getCurrentUser, getUser} from "./controllers/user.controller.js";
import session from 'express-session';
import passport from 'passport';
import User from "./models/User.model.js";
import { getLogout, postLogin, postRegister } from "./controllers/login.controller.js";
import { getMyGroup, getMyGroups, postBlockUserInGroup, postDeleteGroup, postGroup, postJoinGroup, postRenameGroup, postSetAdmin } from "./controllers/group.controller.js";

const options = {
  definition: {
    info: {
      title: "Sistema de alertas",
      version: "0.1.0",
      description:
        "Este es el sistema de alertas de los vecinos",
    }
  },
  apis: ["./*.js"],
};

const app = express();

app.use(session({
  secret: 'Our little secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

mongoose.set('strictQuery',false);
//mongoose.connect('mongodb://localhost:27017/alertaDB',{useNewUrlParser:true});
mongoose.connect(process.env.MONGODB,{useNewUrlParser:true});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.set('view engine', 'ejs');

webpush.setVapidDetails("mailto:test@test.com", process.env.PUBLICKEY, process.env.PRIVATEKEY);

app.get('/', function(req,res){res.render('index')})

app.post('/subscription', async (req, res) => {
  
  let pushSubscription = req.body;
  res.status(200).json();
  const payload = JSON.stringify({
    title: 'My custom notification',
    body: 'Hello world',
  });
  try{
    await webpush.sendNotification(pushSubscription,payload);
  }catch(error){
    console.log(error);
  }
})

app.get('/error', function(req,res){res.send('error de login');});

/** 
 * @swagger
 * /currentUser:
 *   get:
 *     tags:
 *     - Login
 *     summary: Get user logged 
*/
app.get('/currentUser', getCurrentUser);
/** 
 * @swagger
 * /login:
 *   post:
 *     tags:
 *     - Login
 *     summary: Authenticates a user
 *     parameters:
 *      - in: body
 *        name: username
 *        description: email
 *      - in: body
 *        name: password
*/
app.post('/login', postLogin);
/** 
 * @swagger
 * /register:
 *   post:
 *     tags:
 *     - Login
 *     summary: Register a user
 *     parameters:
 *      - in: body
 *        name: username
 *        description: email
 *      - in: body
 *        name: password
 *      - in: body
 *        name: address
 *        description: geographical address
 *      - in: body
 *        name: name
 *        description: User name
*/
app.post('/register', postRegister);
/** 
 * @swagger
 * /logout:
 *   get:
 *     tags:
 *     - Login
 *     summary: Close user session
*/
app.get('/logout', getLogout);


/** 
 * @swagger
 * /groups/new:
 *   post:
 *     tags:
 *     - Groups
 *     summary: Create a new group
 *     parameters:
 *      - in: body
 *        name: groupName
 *        description: Group name
*/
app.post('/groups/new', postGroup);
/** 
 * @swagger
 * /groups/join:
 *   post:
 *     tags:
 *     - Groups
 *     summary: Join user to a group with a code (groupID)
 *     parameters:
 *      - in: body
 *        name: code
 *        description: groupID
*/
app.post('/groups/join',postJoinGroup);
/** 
 * @swagger
 * /groups/myGroups:
 *   get:
 *     tags:
 *     - Groups
 *     summary: Get groupID, groupName, number of integrants, myStatus by each Group 
*/
app.get('/groups/myGroups', getMyGroups);
/** 
 * @swagger
 * /groups/myGroup/:id:
 *   get:
 *     tags:
 *     - Groups
 *     summary: Get Integrants and groupName
 *     parameters:
 *      - in: path
 *        name: id
 *        description: groupID
*/
app.get('/groups/myGroup/:id', getMyGroup);
/** 
 * @swagger
 * /user/:id:
 *   get:
 *     tags:
 *     - Groups
 *     summary: Get a User
 *     parameters:
 *      - in: path
 *        name: id
 *        description: userID
*/
app.get('/user/:id', getUser);


/** 
 * @swagger
 * /groups/blockUser:
 *   post:
 *     tags:
 *     - Admin
 *     summary: Block a user who is in a group
 *     parameters:
 *      - in: body
 *        name: user
 *        description: userID
 *      - in: body
 *        name: group
 *        description: groupID
*/
app.post('/groups/blockUser', postBlockUserInGroup);
/** 
 * @swagger
 * /groups/delete:
 *   post:
 *     tags:
 *     - Admin
 *     summary: Delete a group
 *     parameters:
 *      - in: body
 *        name: id
 *        description: groupID
*/
app.post('/groups/delete', postDeleteGroup);
/** 
 * @swagger
 * /groups/rename:
 *   post:
 *     tags:
 *     - Admin
 *     summary: Change Group name
 *     parameters:
 *      - in: body
 *        name: id
 *        description: groupID
 *      - in: body
 *        name: newname
 *        description: new Group name
*/
app.post('/groups/rename', postRenameGroup);
/** 
 * @swagger
 * /groups/setAdmin:
 *   post:
 *     tags:
 *     - Admin
 *     summary: Allows a user to be admin
 *     parameters:
 *      - in: body
 *        name: user
 *        description: userID
 *      - in: body
 *        name: group
 *        description: groupID
*/
app.post('/groups/setAdmin', postSetAdmin);


/** 
 * @swagger
 * /alerts/new:
 *   post:
 *     tags:
 *     - Alerts
 *     summary: Creates a new alert and sends it to all the groups the user has
*/
app.post('/alerts/new', postAlert);

/** 
 * @swagger
 * /alerts/myGroup/:id:
 *   post:
 *     tags:
 *     - Alerts
 *     summary: Get sender, createdAt, _id, alert by each Alert in Group
 *     parameters:
 *      - in: path
 *        name: id
 *        description: groupID
*/
app.get('/alerts/myGroup/:id', getMyAlertsInGroup);

const port = process.env.PORT || 4000;
app.listen(port, function(){
  console.log('running server on port '+port);
});
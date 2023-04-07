import * as dotenv from 'dotenv'
dotenv.config()

import ejs from 'ejs'
import mongoose from "mongoose";
import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {getMyAlerts, getMyAlertsInGroup, postAlert } from "./controllers/alert.controller.js";
import { getCurrentUser, getUser, protect} from "./controllers/user.controller.js";
import { postLogin, postRegister } from "./controllers/login.controller.js";
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

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

mongoose.set('strictQuery',false);
//mongoose.connect('mongodb://localhost:27017/alertaDB',{useNewUrlParser:true});
mongoose.connect(process.env.MONGODB,{useNewUrlParser:true});

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.set('view engine', 'ejs');


// app.get('/', function(req,res){res.render('index')})


app.get('/error', function(req,res){res.json({message: "error de login"});});

/** 
 * @swagger
 * /user:
 *   get:
 *     tags:
 *     - Login
 *     summary: Get user logged 
*/
app.get('/user', protect, getCurrentUser);
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
app.post('/groups/new', protect, postGroup);
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
app.post('/groups/join',protect, postJoinGroup);
/** 
 * @swagger
 * /groups/myGroups:
 *   get:
 *     tags:
 *     - Groups
 *     summary: Get groupID, groupName, number of integrants, myStatus by each Group 
*/
app.get('/groups/myGroups', protect, getMyGroups);
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
app.get('/groups/myGroup/:id', protect, getMyGroup);
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
app.post('/groups/blockUser', protect, postBlockUserInGroup);
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
app.post('/groups/delete', protect, postDeleteGroup);
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
app.post('/groups/rename', protect, postRenameGroup);
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
app.post('/groups/setAdmin', protect, postSetAdmin);


/** 
 * @swagger
 * /alerts/new:
 *   post:
 *     tags:
 *     - Alerts
 *     summary: Creates a new alert and sends it to all
*/
app.post('/alerts/new', protect, postAlert);

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
app.get('/alerts/myGroup/:id', protect, getMyAlertsInGroup);

/** 
 * @swagger
 * /alerts/myGroup/:id:
 *   post:
 *     tags:
 *     - Alerts
 *     summary: Get sender, createdAt, _id, alert by each Alert
 *     parameters:
 *      - in: path
 *        name: id
 *        description: groupID
*/
app.get('/alerts', protect, getMyAlerts);


const port = process.env.PORT || 4000;
app.listen(port, function(){
  console.log('running server on port '+port);
});
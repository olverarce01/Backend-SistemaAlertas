import * as dotenv from 'dotenv'
dotenv.config()

// import ejs from 'ejs'
import express from "express";
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {getMyAlerts, postAlert } from "./controllers/alert.controller.js";
import { getCurrentUser, getUser, protect} from "./controllers/user.controller.js";
import { postLogin, postRegister } from "./controllers/login.controller.js";
import { postSaveToken } from './controllers/notification.controller.js';

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

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(express.static('public'));
// app.set('view engine', 'ejs');

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
app.post('/suscribe', postSaveToken);
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
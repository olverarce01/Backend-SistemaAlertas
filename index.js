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
 *     summary: Obtener datos de un usuario
 *     description: Obtener datos de un usuario Logeado, como (username, name, address, password). Se necesita tener tokenJWT
*/
app.get('/user', protect, getCurrentUser);
/** 
 * @swagger
 * /login:
 *   post:
 *     tags:
 *     - Login
 *     summary: Autentica un Usuario
 *     description: Autentica y retorna datos del Usuario (_id, username, name, address, token), necesita de username y password
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
 *     summary: Registra un Usuario
 *     description: Registra y devuelve los datos del Usuario (_id, username, name, token), necesita de username, password, address y address
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
 * /suscribe:
 *   post:
 *     tags:
 *     - Login
 *     summary: Guarda el token del Usuario
 *     description: Guarda token para recibir notificaciones
 *     parameters:
 *      - in: body
 *        name: token
 *        description: token de Firebase
*/
app.post('/suscribe', postSaveToken);
/** 
 * @swagger
 * /user/:id:
 *   get:
 *     tags:
 *     - Login
 *     summary: Obtener un Usuario por el id
 *     description: Obtener un Usuario y retorna (_id, username, name, address, password, address)
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
 *     summary: Crea una alerta y la envia a todos los Usuarios
 *     description: Crea una alerta y se conecta con la Firebase para enviar a cada token. Se necesita tener tokenJWT.
*/
app.post('/alerts/new', protect, postAlert);
/** 
 * @swagger
 * /alerts:
 *   get:
 *     tags:
 *     - Alerts
 *     summary: Obtiene todas las alertas
 *     description: Obtiene todas las alertas, cada una con (sender,createdAt,updateAt)
*/
app.get('/alerts', protect, getMyAlerts);


const port = process.env.PORT || 4000;
app.listen(port, function(){
  console.log('running server on port '+port);
});
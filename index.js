import mongoose from "mongoose";
import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { getAlerts, getMyAlerts, postAlert } from "./controllers/alert.controller.js";
import { getUser, getUsers, postUser } from "./controllers/user.controller.js";
import session from 'express-session';
import passport from 'passport';
import User from "./models/User.model.js";
import { getLogout, postLogin, postRegister } from "./controllers/login.controller.js";

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
mongoose.connect('mongodb://localhost:27017/alertaDB',{useNewUrlParser:true});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
 * @swagger
 * tags:
 *  name: Alertas
 *  description: Gestion de alertas 
 */

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/error', function(req,res){res.send('error de login');});



app.get('/alerts',getAlerts);
app.post('/alert', postAlert);
app.get('/myAlerts', getMyAlerts);

app.get('/users', getUsers);
app.post('/user', postUser);
app.get('/user/:id', getUser);
app.post('/login', postLogin);
app.post('/register', postRegister);

app.get('/logout', getLogout);


app.listen(4000, function(){
  console.log('running server on port 4000');
});
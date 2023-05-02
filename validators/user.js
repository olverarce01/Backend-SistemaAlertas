import {check, body} from 'express-validator';
import {validateResult} from '../helpers/validateHelper.js';
const validateCreate = [
  body('username')
  .notEmpty().withMessage("Is Empty")
  .isEmail().withMessage("Isn't a Email"),
  body('password')
  .notEmpty().withMessage("Is Empty")
  .isLength({min: 5}).withMessage("Min length is 5"),
  body('address')
  .notEmpty().withMessage("Is Empty"),
  body('name')
  .notEmpty().withMessage("Is Empty")
  .isLength({min: 3}).withMessage("Min length is 3")
  ,(req,res,next)=>{
    validateResult(req,res,next)
  }
]
export default validateCreate;
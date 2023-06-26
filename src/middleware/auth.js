const jwt = require('jsonwebtoken')
const createError = require('http-errors')

const protect =(req, res, next)=>{
  try{
    let token
    if(req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token, process.env.SECRETE_KEY_JWT);
        req.payload = decoded
        next()
    }else{
        res.json({
            message : "server need token"
        })
    }
  }catch(error){
    console.log(error);
    if(error && error.name ==='JsonWebTokenError'){
      next(new createError(400,'Token invalid'))
    }else if(error && error.name ==='TokenExpiredError'){
      next(new createError(400,'Token expired'))
    }else{
      next(new createError(400,'Token not active'))
    }
  }
}

const validationRoleSeller = (req, res, next) => {
  try {
    const role = req.payload.role
    if (role === 'seller') {
        next();
      } else {
        throw {
          statusCode : 403,
          message : "Only seller can post a product to sell!"
        }
      }
  } catch (error) {
    console.log(error)
    next(new createError(error.statusCode, error));
  }
}

// const validationRoleCustomer = (req, res, next) => {
//   try {
//     const role = req.payload.role;
//     if (role === 'customer') {
//         next();
//       } else {
//         throw {
//           statusCode : 403,
//           message : "Authorization error!"
//         }
//       }
//   } catch (error) {
//     console.log(error)
//     next(new createError(error.statusCode, error));
//   }
// }

module.exports = {protect, validationRoleSeller}
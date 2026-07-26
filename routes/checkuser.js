var jwt=require("jsonwebtoken")
var dotenv =require('dotenv')
dotenv.config()
function verify_token (token)
{
     
          
     
     try{
     console.log (token)
     const sk= process.env.JWT_KEY
     var user=jwt.verify(token,sk)
     console.log(user)
     return(user)
     next()
     }
     catch(error)
     {
     return false

     }
     

}   

module.exports=verify_token
var express = require('express');
var router = express.Router();
var pool=require('./pool')
const dotenv =require('dotenv')
dotenv.config()
var {LocalStorage}=require('node-localstorage')
var localStorage=new LocalStorage('./scratch')
var verify_token =require("./checkuser")
var jwt = require('jsonwebtoken');
const session = require('express-session');
/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard');
});
// Check whether the admin is already logged in.
// If logged in, open Dashboard; otherwise, show the Login page.
router.get("/login_interface", function (req, res, next) {
    var user = verify_token(localStorage.getItem("TOKEN"));
    console.log("User data:", user);

    try {
        if (user) {
            res.render("dashboard", { data: user.user });
        } else {
            res.render("login", { message: "" });
        }
    } catch (error) {
        
        res.render("login", { message: "" });
    }
});


router.post('/chk_login', function(req, res, next) {
  pool.query("select * from admins where (emailid=? or mobileno=?) and password=?",[req.body.emailid,req.body.emailid,req.body.password],function(error,result){
   if(error)
   {
    console.log(error)
    res.render("login",{message:'Server Error....'})
   }
   else
   {
    if(result.length==1)
    {//localStorage.setItem("ADMIN",JSON.stringify(result[0]))
      //req.session.user=JSON.stringify(result[0])
      const sk= process.env.JWT_KEY
      var token = jwt.sign(
  { user: result[0] },
  sk,
  { expiresIn: "30m" }
);
      console.log("TOKEN:", token);
      localStorage.setItem("TOKEN", token);
    
    res.render("dashboard",{data:result[0]})}
      
  else
    res.render("login",{message:'Invalid Email/Mobile Number/Password...'})
   }

  })
  
});

router.get('/logout', function(req, res, next) {
  
localStorage.clear()
//req.session.destroy()
res.redirect('/admin/login_interface')


});



module.exports = router;

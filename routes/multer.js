var multer = require("multer"); // upar baata rhe file kaha se save karne 
const { v4: uuidv4 } = require('uuid');
var diskSetting = multer.diskStorage({
    destination: (req, file, path) => {
        path(null, 'public/images')   // ese null mean hai apne mein system  file ko save karna hai 
    },
    filename: (req, file, path) => {  // ese naam ke liye usse hota hai
    filename=uuidv4()+file.originalname.substring(file.originalname.lastIndexOf("."))// UUID unique filename generate karta hai aur original filename ko remove kar deta hai. substring() file ka extension (.jpg, .png) nikal kar UUID ke saath jod deta hai.
    path(null, filename)
    }
})
 var upload=multer({storage:diskSetting})
module.exports=upload
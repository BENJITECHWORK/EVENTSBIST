const jwt=require('jsonwebtoken')
// const multer=require('multer')
/*************************IMAGE MIDDLEWARE***************************************** */
// exports.storage=multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,'uploads')
//     },
//     filename:(req,file,cb)=>{
//         cb(null,file.originalname)
//     }
// })
/*************************AUTHORIZATION***************************************** */

exports.authorizeRequest=async(req,res,next)=>{
   try{
    //decoding token for verification
      const auth_header = req.headers.authorization;
      if(!auth_header){
        return res.status(401).json({
            success:true,
            message:"UnAuthorized Access",
        })
      }

      const token=auth_header.split(' ')[1];
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();

   }catch(error){
      return res.status(401).json({
        success:false,
        message:"UnAuthorized Access",
        error:error.message
    })
   }
 
}

/*************************ROLE CHECK***************************************** */
exports.checkRole=(role)=>async(req,res,next)=>{
  
    if(req?.user.user.roleId !== role){
        return res.status(401).json({
            success:false,
            message:"Permission Denied"
        })
    }
    next()
}

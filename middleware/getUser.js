const jwt = require('jsonwebtoken');
const mysign="imtg@ilimbsdcaiaaaiaowin";

const getuser=(req,res,next)=>{
    const token=req.header('authToken');
    if(!token){
        res.status(401).json({"Status":"Invalid Token! Please try again"})
    }
    try{
    const data= jwt.verify(token,mysign);
     req.user=data.user;
    next();
    }catch(error){
        console.error(error.message)
        res.status(401).json({"Status":"Invalid Token! Please try again"});
    }
}

module.exports=getuser;
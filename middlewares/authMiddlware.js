const jwt=require("jsonwebtoken");
const User=require("../models/User.js");// model importing for loking up later
const protectRoute=async(req,res,next)=>{
   console.log("protectRoute middleware invoked");
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized. No token provided."});
        }
if(token)
{//token,secret,options
    const decodedToken=jwt.verify(token,process.env.JWT_SECRET); 
    const resp=await User.findById(decodedToken.id).select("-password");//only fetch the required data ,not the complete details of the user
    req.user={
        email:resp.email,
        userId:decodedToken.id
    }
    next();
    // req.user=decodedToken;  
}

    }

catch(err){
    console.error("Error in protectRoute middleware:", err);
   return res.status(401).json({ status:false ,message:"not authorized.try logging in again"});

}}
module.exports={protectRoute}
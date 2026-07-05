const jwt=require("jsonwebtoken");
const User=require("../models/User.js");// model importing for loking up later
const protectRoute=async(req,res,next)=>{
    try{
        console.log("COOKIE:", req.cookies);
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized. No token provided."});
        }
if(token)
{//token,secret,options
    const decodedToken=jwt.verify(token,process.env.JWT_SECRET); 
    console.log("decodedToken",decodedToken)
    const resp=await User.findById(decodedToken.userId).select("-password");//only fetch the required data ,not the complete details of the user
    console.log("resp",resp)
    // req.user=resp;
    req.user = {
  id: resp._id.toString(),
  name: resp.name,
  email: resp.email,
};
    
    
    
    
    //a mongodb document
    console.log("req.user",req.user)
    next();
}

    }

catch(err){
    console.error("Error in protectRoute middleware:", err);
   return res.status(401).json({ status:false ,message:"not authorized.try logging in again"});

}}
module.exports={protectRoute}
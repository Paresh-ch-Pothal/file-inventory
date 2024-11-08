const JWT=require("jsonwebtoken");
const JWT_SECRET="^@12@34#%^&8@1%6$5^&#1234";


const fetchuser=(req,res,next)=>{
    const token=req.header("auth-token");
    if(!token){
        return res.status(400).json({success: false,message:"No token is found"});
    }
    try {
        const data=JWT.verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    } catch (error) {
        return res.status(401).send("Some internal error might be happened");
    }
}

module.exports=fetchuser;
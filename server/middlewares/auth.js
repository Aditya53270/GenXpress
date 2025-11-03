import jwt from "jsonwebtoken";


const userAuth=async(req,res,next)=>{
    let token = req.headers.authorization || req.headers.token || req.query.token || req.body?.token;
    if(!token){
        return res.json({success:false,message:'unauthorized user'})

    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }
    try{
        const tokenDecode=jwt.verify(token,process.env.JWT_SECRET);
        if(tokenDecode.id){
            req.userId=tokenDecode.id;

        }
        else{
            return res.json({success:false,message:'unauthorized user'})

        }
        next(); 
    }catch(error){
          res.json({success:false,message:error.message})
         

    }


};
export default userAuth;
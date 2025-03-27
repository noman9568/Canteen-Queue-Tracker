const jwt = require('jsonwebtoken');

exports.authMiddleware = async(req,res,next) =>{
  const token = req.header("Authorization")?.split(' ')[1];

  if(!token){
    return res.status(401).json({message : "Unauthorized access! No token provided."});
  }

  try {
    const decoded = await jwt.verify(token,process.env.JWT_SECRET);
    res.user = decoded;
    next();
  }
  catch(error){
    return res.status(403).json({message : "Invalid or expired token!"});
  }
}
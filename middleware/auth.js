const jwt = require ("jsonwebtoken");
const config = require("config");
module.exports =(req, res, next)=>{
  const token = req.headers("x-access-token");
  if (!token){
    return res.status(400).json({msg: "Athorization denied"});
    }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user= decoded.user;
    next();

  }catch (err){
    console.log(err.message)
  }
}

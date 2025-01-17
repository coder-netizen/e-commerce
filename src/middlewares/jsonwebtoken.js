
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
   

    // get the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.log("Authorization header is missing");
        return res.status(401).json({ message: "Authorization header is required" });
    }

    // get the token from the header
    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log("Bearer token is missing");
        return res.status(401).json({ message: "Bearer token is required" });
    }

    

    // Verify the token
    jwt.verify(token, process.env.JWTSECRETKEY, (err, decoded) => {
        if (err) {
           
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        
        req.user = decoded; 
        next();
    });
}

module.exports = verifyToken;

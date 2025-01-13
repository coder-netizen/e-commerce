
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    console.log("Middleware execution started"); // Confirm middleware execution

    // Extract the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.log("Authorization header is missing");
        return res.status(401).json({ message: "Authorization header is required" });
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log("Bearer token is missing");
        return res.status(401).json({ message: "Bearer token is required" });
    }

    console.log("Token received:", token); // Debugging log

    // Verify the token
    jwt.verify(token, process.env.JWTSECRETKEY, (err, decoded) => {
        if (err) {
            console.log("Token verification failed:", err.message); // Log verification error
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        console.log("Decoded token:", decoded); // Log the decoded payload
        req.user = decoded; // Attach the decoded payload to the request
        next();
    });
}

module.exports = verifyToken;

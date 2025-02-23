import jwt from 'jsonwebtoken';




export default function authMidWare(req, res, next) {
    // Pull token from header
    const token = req.header('x-auth-token');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ errors: [{msg: 'No token, Authorization Denied' }] });
    }

    
}   
    // Verify token
    try {
      // Decode token | Check if token from frontend came from us
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Save decoded user to request object
      req.user = decoded.user;
      next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ errors: [{msg: 'Token is not valid' }] });
    }
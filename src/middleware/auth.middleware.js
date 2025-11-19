import jwt from "jsonwebtoken";
import config from "../config/config.js";


export async function authArtistMiddleware(req, res, next) {

    // Check for token in cookies or Authorization header
    let token = req.cookies.token;
    
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7); // Remove 'Bearer ' prefix
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }


    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        if (decoded.role !== 'artist') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: 'Unauthorized' });
    }

}

export async function authUserMiddleware(req, res, next) {

    // Check for token in cookies or Authorization header
    let token = req.cookies.token;
    
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7); // Remove 'Bearer ' prefix
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: 'Unauthorized' });
    }

}
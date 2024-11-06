const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const validationtoken = (req, res, next) => {
    const token = req.headers['authorization']; 
    if (token) {
        console.log(token);

    try {
        const verified = jwt.verify(token ,process.env.TOKEN_SECRET ); 
        req.user = verified;
        if (req.params.id == req.user._id || req.user.role =="adminserver") 
            next();
        else
        res.status(403).send('Access denied. You are not authorized to access this resource.');

    } catch (err) {
        res.status(400).send('Invalid token.');
    }
}
    else 
    res.status(401).send('Access denied. No token provided.');
};

const adminserver = (req, res, next) => {
    const token = req.headers['authorization']; 
    if (token) {
        console.log(token);

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET); 
        req.user = verified;
        if (req.user.role =="adminserver") 
            next();
        else
        res.status(403).send('Access denied. You are not authorized to access this resource.');

    } catch (err) {
        res.status(400).send('Invalid token.');
    }
}
    else 
    res.status(401).send('Access denied. No token provided.');
};
        


module.exports = { validationtoken , adminserver };

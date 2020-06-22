const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    let decodedToken;
    // console.log(authHeader);
    if(!authHeader) {
        console.log("not auth");
        res.status(401).json({error: "not valid"});
    }
    else {
        const token = authHeader.split(' ')[1];
        decodedToken = jwt.verify(token, 'some12$234%^3randomstring4646^*^*@#446idontknowwhyiusedthis3Qe@#2#@#@');
        // console.log(token);
        // console.log(decodedToken);
        if(!decodedToken) {
            console.log(!decodedToken);
            res.status(401).json({error: "not valid"});
        }
        else{
            req.userId = decodedToken.userId;
        }
    }
    // console.log(decodedToken);
    next();
}
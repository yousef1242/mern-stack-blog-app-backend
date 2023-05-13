const jwt  = require("jsonwebtoken");

const verifyToken = (req,res,next) => {
    const authToken = req.headers.authorization
    if (authToken) {
        const token = authToken.split(" ")[1]
        try {
            const decodedPlayload = jwt.verify(token,process.env.JWT_SECRET)
            req.user = decodedPlayload
            next()
        } catch (error) {
            return res.status(401).json({message : 'no token provided'})
        }
    } else {
        return res.status(401).json({message : 'invalid token, access deniend'})
    } 
}


const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res,() => {
        if (req.user.isAdmin) {
            next()
        }else{
            return res.status(403).json({message : 'only admin'})
        }
    })
}


const verifyTokenAndOnlyUser = (req,res,next) => {
    verifyToken(req,res,() => {
        if (req.user.id === req.params.id) {
            next()
        }else{
            return res.status(403).json({message : 'only user him self'})
        }
    })
}


const verifyTokenAndOnlyUserAndAdmin = (req,res,next) => {
    verifyToken(req,res,() => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        }else{
            return res.status(403).json({message : 'only user him self or admin'})
        }
    })
}


module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndOnlyUser,
    verifyTokenAndOnlyUserAndAdmin,
}
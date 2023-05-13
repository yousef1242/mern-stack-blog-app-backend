const router = require('express').Router()
const { registerUserCtr, loginUserCtr } = require('../controllers/authControler')


///api/auth/register
router.post('/api/auth/register',registerUserCtr)

///api/auth/login
router.post('/api/auth/login',loginUserCtr)


module.exports = router
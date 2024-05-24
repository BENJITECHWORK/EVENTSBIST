const express = require('express')

const router = express.Router()
const { authorizeRequest, checkRole } = require('../middleware/middleware')

const { 
    register,
    login,
    generatePasswordToken,
    updatePassword,
} = require('../controllers/auth');
const { createService, getAllServicesByUserId, getServiceById, updateService, deleteService } = require('../controllers/serviceController');


router.post('/register', register);
router.post('/login', login)
router.post('/reset',generatePasswordToken);
router.post('/update-password',updatePassword);

/* Service routes */

router.post('/services/create',createService);
router.get('/services/user/:userId', getAllServicesByUserId)
router.get('/services/:serviceId', getServiceById)
router.patch('/services/:serviceId',updateService)
router.delete('/services/:serviceId',deleteService)

router.get('/protected',authorizeRequest,checkRole(1),(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Protected Route",
        user:req.user
    })
})

module.exports = router;
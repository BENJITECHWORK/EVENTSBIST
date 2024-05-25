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
const { createServiceCategory, getAllServicesCategories, updateServiceCategory, deleteServiceCategory } = require('../controllers/serviceCategoryController');


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


/*  Service Category Routes */
router.post('/service/categories',authorizeRequest,checkRole(1), createServiceCategory)
router.get('/service/categories',authorizeRequest, checkRole(1),getAllServicesCategories)
router.patch('/service/category/:serviceCategoryId',authorizeRequest,checkRole(1),updateServiceCategory)
router.delete('/service/category/:serviceCategoryId',authorizeRequest,checkRole(1),deleteServiceCategory)


router.get('/protected',authorizeRequest,checkRole(1),(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Protected Route",
        user:req.user
    })
})

module.exports = router;
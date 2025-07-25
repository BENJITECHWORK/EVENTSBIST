const express = require('express')

const router = express.Router()
const { authorizeRequest, checkRole } = require('../middleware/middleware')

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { 
    register,
    login,
    generatePasswordToken,
    updatePassword,
} = require('../controllers/auth');
const { createService, getAllServicesByUserId, getServiceById, updateService, deleteService, getAllServicesByCategory, getAllServices, getAllServicesBySelectedCategory, adminAddPromotion, markServiceAsBooked } = require('../controllers/serviceController');
const { createServiceCategory, getAllServicesCategories, updateServiceCategory, deleteServiceCategory } = require('../controllers/serviceCategoryController');
const { createEventType, getAllEventTypes } = require('../controllers/eventTypeController');
const { getDashboardStats } = require('../controllers/dashboardController');


router.post('/register', register);
router.post('/login', login)
router.post('/reset',generatePasswordToken);
router.post('/update-password',updatePassword);

/* Service routes */

router.post('/services/create',createService);
router.get('/services/user/:userId', getAllServicesByUserId)
router.get('/services/category/:service_category_id', getAllServicesByCategory)
router.get('/services/:serviceId', getServiceById)
router.patch('/services/:serviceId',updateService)
router.delete('/services/:serviceId',deleteService)
router.get('/services',getAllServices)

//
router.get('/services/selected_categories/:selectedCategoryIds/location/:location', getAllServicesBySelectedCategory);



/*  Service Category Routes */
router.post('/service/categories',authorizeRequest, createServiceCategory) //checkRole(1),
router.get('/service/categories',authorizeRequest, getAllServicesCategories)
router.patch('/service/category/:serviceCategoryId',authorizeRequest,checkRole(1),updateServiceCategory)
router.delete('/service/category/:serviceCategoryId',authorizeRequest,checkRole(1),deleteServiceCategory)
router.post('/services/book',markServiceAsBooked)

/* Events */
router.post('/events/create',createEventType)
router.get('/events/types',getAllEventTypes)


router.get('/dashboard',getDashboardStats);

/* Promotions */
router.post('/promotions/add',adminAddPromotion)


router.get("/chat-history/:userId1/:userId2", async (req, res) => {
    const { userId1, userId2 } = req.params;
  
    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId1, recipientId: userId2 },
            { senderId: userId2, recipientId: userId1 },
          ],
        },
        orderBy: { createdAt: "asc" },
      });
  
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).send("Error fetching chat history");
    }
  });
  

router.get('/protected',authorizeRequest,checkRole(1),(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Protected Route",
        user:req.user
    })
})

module.exports = router;
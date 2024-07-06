const { PrismaClient } = require("@prisma/client");

/***************************************DASHBOARD CONTROLLER********************************************************/
const prisma = new PrismaClient();


exports.getDashboardStats = async (req, res) => {
    try {
      const serviceCount = await prisma.service.count();
      const userCount = await prisma.user.count();
      const serviceCategoryCount = await prisma.serviceCategory.count();
      const eventTypeCount = await prisma.eventType.count();
  
      return res.status(200).json({
        services: serviceCount,
        users: userCount,
        service_categories: serviceCategoryCount,
        event_types: eventTypeCount,
        success: true,
      });
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({
        error: error.message,
        success: false,
      });
    }
  };
  
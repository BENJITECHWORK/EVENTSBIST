const { PrismaClient } = require("@prisma/client");

/***************************************Service Category CONTROLLER********************************************************/
const prisma = new PrismaClient();

exports.createServiceCategory = async (req, res) => {
  try {
    const { service_category_name, service_category_description, userId } =
      req.body;
    //check whether field exists
    if (!service_category_name || !service_category_description || !userId) {
      return res.status(404).json({
        success: false,
        message: "This Field Cannot be empty",
      });
    }
    /* Check whether service exists */
    const existingService = await prisma.serviceCategory.findUnique({
      where: {
        service_category_name,
      },
    });

    if (existingService) {
      return res.status(404).json({
        success: false,
        message: "Service Already exists",
      });
    }
    /********************************* Create a Service ************************/
    const newService = await prisma.serviceCategory.create({
      data: {
        service_category_name,
        service_category_description,
        userId,
      },
    });

    return res.status(200).json({
      message: "Service Category Created Successfully",
      success: true,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error: error,
      success: false,
    });
  }
};

exports.getAllServicesCategories = async (req, res) => {
  try {
    const services = await prisma.serviceCategory.findMany();
    return res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error: error,
      success: false,
    });
  }
};

//update service category
exports.updateServiceCategory = async (req, res) => {
  try {
    const { serviceCategoryId } = req.params;
    const { service_category_name, service_category_description } = req.body;

    // Check if the service exists
    const serviceCategoryExists = await prisma.serviceCategory.findUnique({
      where: { service_category_id: Number(serviceCategoryId) },
    });

    if (!serviceCategoryExists) {
      return res.status(404).json({ message: "Service not found" });
    }

    const serviceCategory = await prisma.serviceCategory.update({
      where: {
        service_category_id: parseInt(serviceCategoryId),
      },
      data: {
        service_category_name,
        service_category_description,
      },
    });

    return res.status(200).json({
      success: true,
      serviceCategory,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error: error,
      success: false,
    });
  }
};

//delete service category

exports.deleteServiceCategory = async (req, res) => {
  try {
    const { serviceCategoryId } = req.params;

    // Check if the service exists
    const serviceCategoryExists = await prisma.serviceCategory.findUnique({
      where: { service_category_id: Number(serviceCategoryId) },
    });

    if (!serviceCategoryExists) {
      return res.status(404).json({ message: "Service not found" });
    }

    const service = await prisma.serviceCategory.delete({
      where: {
        service_category_id: parseInt(serviceCategoryId),
      },
    });

    return res.status(200).json({
      success: true,
      service,
    });

  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error: error,
      success: false,
    });
  }
};

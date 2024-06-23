const { PrismaClient } = require("@prisma/client");

/***************************************Service CONTROLLER********************************************************/
const prisma = new PrismaClient();

exports.createService = async (req, res) => {
  try {
    const {
      service_name,
      service_description,
      service_price,
      service_category_id,
      userId,
    } = req.body;
    //check whether field exists
    if (
      !service_name ||
      !service_description ||
      !service_price ||
      !service_category_id ||
      !userId
    ) {
      return res.status(404).json({
        success: false,
        message: "This Field Cannot be empty",
      });
    }
    /* Check whether service exists */
    const existingService = await prisma.service.findUnique({
      where: {
        service_name: service_name,
      },
    });

    if (existingService) {
      return res.status(404).json({
        success: false,
        message: "Service Already exists",
      });
    }
    /********************************* Create a Service ************************/
    const newService = await prisma.service.create({
      data: {
        service_category_id,
        service_name,
        service_description,
        service_price,
        userId,
      },
    });

    return res.status(200).json({
      message: "Service Created Successfully",
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

exports.getAllServicesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const services = await prisma.service.findMany({
      where: {
        userId: parseInt(userId),
      },
    });
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

exports.getAllServicesByCategory = async (req, res) => {
  try {
    const { service_category_id } = req.params;
    const services = await prisma.service.findMany({
      where: {
        service_category_id: parseInt(service_category_id),
      },
    });
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

exports.getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await prisma.service.findUnique({
      where: {
        id: parseInt(serviceId),
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

exports.updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const {
      service_name,
      service_description,
      service_price,
      service_category,
    } = req.body;

    // Check if the service exists
    const serviceExists = await prisma.service.findUnique({
      where: { id: Number(serviceId) },
    });

    if (!serviceExists) {
      return res.status(404).json({ message: "Service not found" });
    }

    const service = await prisma.service.update({
      where: {
        id: parseInt(serviceId),
      },
      data: {
        service_name,
        service_description,
        service_price,
        service_category,
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

exports.deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    // Check if the service exists
    const serviceExists = await prisma.service.findUnique({
      where: { id: Number(serviceId) },
    });

    if (!serviceExists) {
      return res.status(404).json({ message: "Service not found" });
    }
    const service = await prisma.service.delete({
      where: {
        id: parseInt(serviceId),
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

exports.getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        user: true,
        service_category: true,
      },
    });
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

exports.getAllServicesBySelectedCategory = async (req, res) => {
  try {
    const { selectedCategoryIds } = req.params;
    const results = JSON.parse(selectedCategoryIds);
    console.log("results", results);
    const services = await prisma.service.findMany({
      where: {
        OR: results.map(categoryId => ({
          service_category_id: categoryId,
        })),
      },
    });

    return res.status(200).json({
      success: true,
      services
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error: error,
      success: false,
    });
  }
};

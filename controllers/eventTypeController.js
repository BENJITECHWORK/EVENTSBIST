const { PrismaClient } = require("@prisma/client");

/***************************************EVENT TYPE CONTROLLER********************************************************/
const prisma = new PrismaClient();

exports.createEventType = async (req, res) => {
  try {
    const { event_type, description } = req.body;

    if (!event_type || !description) {
      return res.status(404).json({
        success: false,
        message: "This Field Cannot be empty",
      });
    }

    /* Check whether service exists */
    const existingService = await prisma.eventType.findUnique({
      where: {
        event_type,
      },
    });

    if (existingService) {
      return res.status(404).json({
        success: false,
        message: "Event Type Already exists",
      });
    }
    /********************************* Create a Service ************************/
    const newService = await prisma.eventType.create({
      data: {
        event_type,
        description,
      },
    });

    return res.status(200).json({
      message: "Event Type Created Successfully",
      success: true,
      data: newService,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error: error,
      success: false,
    });
  }
};

exports.getAllEventTypes = async (req, res) => {
  try {
    const eventTypes = await prisma.eventType.findMany({});
    return res.status(200).json({
      success: true,
      eventTypes,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error: error,
      success: false,
    });
  }
};

exports.getEventTypeById = async (req, res) => {
  try {
    const { eventTypeId } = req.params;
    const eventType = await prisma.eventType.findUnique({
      where: {
        id: parseInt(eventTypeId),
      },
    });
    return res.status(200).json({
      success: true,
      eventType,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error: error,
      success: false,
    });
  }
};

exports.updateEventType = async (req, res) => {
  try {
    const { eventTypeId } = req.params;
    const { event_type, description } = req.body;

    // Check if the service exists
    const eventTypeExists = await prisma.eventType.findUnique({
      where: { id: Number(eventTypeId) },
    });

    if (!eventTypeExists) {
      return res.status(404).json({ message: "Event Type not found" });
    }

    const eventType = await prisma.eventType.update({
      where: {
        id: parseInt(eventTypeId),
      },
      data: {
        event_type,
        description,
      },
    });

    return res.status(200).json({
      message: "Event Type Updated Successfully",
      success: true,
      eventType,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error: error,
      success: false,
    });
  }
};

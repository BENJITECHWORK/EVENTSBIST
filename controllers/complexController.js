const { PrismaClient } = require("@prisma/client");

/***************************************Complex CONTROLLER********************************************************/
const prisma = new PrismaClient();

async function getServicesByAllCategories(selectedCategoryIds = []) {
    const services = await prisma.service.findMany({
      where: {
        OR: selectedCategoryIds.map(categoryId => ({
          service_category_id: categoryId,
        })),
      },
    });
    return services;
  }

// Example usage:
const selectedCategoryIds = [6, 3]; // Replace with actual category IDs selected by the user
getServicesByAllCategories(selectedCategoryIds)
  .then(services => {
    console.log(services);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    prisma.$disconnect();
});
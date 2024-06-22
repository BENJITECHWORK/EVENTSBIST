const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to create a new booking
const createBooking = async (req, res) => {
    const { event_date, event_name, location, event_organizer_id, service_provider_id, event_type_id, service_id } = req.body;
    try {
        const newBooking = await prisma.booking.create({
            data: {
                event_date: new Date(event_date),
                event_name,
                location,
                event_organizer_id,
                service_provider_id,
                event_type_id,
                service_id
            }
        });
        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Failed to create booking:', error);
        res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }
};

// Function to get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                EventType: true,
                ServiceProvider: true,
                Organizer: true,
                Service: true
            }
        });
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Failed to retrieve bookings:', error);
        res.status(500).json({ message: 'Failed to retrieve bookings', error: error.message });
    }
};

// Function to get bookings by event organizer
const getBookingsByOrganizer = async (req, res) => {
    const { organizerId } = req.params;
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                event_organizer_id: parseInt(organizerId)
            },
            include: {
                EventType: true,
                ServiceProvider: true,
                Organizer: true,
                Service: true
            }
        });
        res.status(200).json(bookings);
    } catch (error) {
        console.error(`Failed to retrieve bookings for organizer ${organizerId}:`, error);
        res.status(500).json({ message: 'Failed to retrieve bookings', error: error.message });
    }
};

// Function to get bookings by service provider
const getBookingsByServiceProvider = async (req, res) => {
    const { providerId } = req.params;
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                service_provider_id: parseInt(providerId)
            },
            include: {
                EventType: true,
                ServiceProvider: true,
                Organizer: true,
                Service: true
            }
        });
        res.status(200).json(bookings);
    } catch (error) {
        console.error(`Failed to retrieve bookings for service provider ${providerId}:`, error);
        res.status(500).json({ message: 'Failed to retrieve bookings', error: error.message });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingsByOrganizer,
    getBookingsByServiceProvider
};
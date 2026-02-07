import ClinicSettings from '../models/ClinicSettings.js';

// @desc    Get clinic schedule settings
// @route   GET /api/settings/schedule
// @access  Public
export const getSchedule = async (req, res) => {
    try {
        let settings = await ClinicSettings.findOne();

        if (!settings) {
            // Create default settings if not exists
            settings = await ClinicSettings.create({
                timeSlots: [
                    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
                    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
                ],
                workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                holidays: []
            });
        }

        res.json(settings);
    } catch (error) {
        console.error('Get Schedule Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update clinic schedule settings
// @route   PUT /api/settings/schedule
// @access  Private/Admin
export const updateSchedule = async (req, res) => {
    try {
        const { timeSlots, workingDays, holidays } = req.body;

        let settings = await ClinicSettings.findOne();

        if (settings) {
            settings.timeSlots = timeSlots || settings.timeSlots;
            settings.workingDays = workingDays || settings.workingDays;
            settings.holidays = holidays || settings.holidays;

            const updatedSettings = await settings.save();
            res.json(updatedSettings);
        } else {
            // Should not happen if getSchedule runs first, but for safety
            const newSettings = await ClinicSettings.create({
                timeSlots,
                workingDays,
                holidays
            });
            res.status(201).json(newSettings);
        }

    } catch (error) {
        console.error('Update Schedule Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

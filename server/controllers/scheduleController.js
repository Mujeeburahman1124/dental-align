import Schedule from '../models/Schedule.js';
import User from '../models/User.js';

// @desc    Get schedule for a dentist
// @route   GET /api/schedules/dentist/:dentistId
// @access  Public
export const getDentistSchedule = async (req, res) => {
    try {
        const schedules = await Schedule.find({ dentistId: req.params.dentistId }).populate('branchId', 'name location');
        res.json(schedules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Check doctor availability at a branch/time
// @route   GET /api/schedules/check-availability
// @access  Public
export const checkAvailability = async (req, res) => {
    try {
        const { dentistId, date, time, branchId } = req.query;

        if (!dentistId || !date || !time) {
            return res.status(400).json({ message: 'Dentist, Date and Time are required' });
        }

        const dateObj = new Date(date);
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

        // Find schedule for that day
        const schedule = await Schedule.findOne({
            dentistId,
            dayOfWeek,
            isGovHospitalDay: false
        });

        if (!schedule) {
            // Check if it's a gov day
            const govDay = await Schedule.findOne({ dentistId, dayOfWeek, isGovHospitalDay: true });
            if (govDay) {
                return res.json({
                    available: false,
                    message: `Dr. is not available today (Government Hospital duty).`,
                    type: 'gov_hospital'
                });
            }
            return res.json({ available: false, message: 'Doctor is not scheduled for this day.' });
        }

        // Check if doctor is at the requested branch
        if (branchId && schedule.branchId.toString() !== branchId) {
            const currentBranch = await schedule.populate('branchId', 'name');
            return res.json({
                available: false,
                message: `Doctor is at ${currentBranch.branchId.name} branch at this time.`,
                type: 'wrong_branch',
                correctBranch: currentBranch.branchId.name
            });
        }

        // Check lunch time
        // Note: Simple string comparison for time slots like "12:30 PM" needs more care
        // Assuming time is in "HH:MM AM/PM" format or similar.
        // For simplicity, let's say lunch is 12:00 PM to 01:00 PM
        const isLunchTime = (time) => {
            const t = time.toUpperCase();
            return t.includes('12:00 PM') || t.includes('12:30 PM');
        };

        if (isLunchTime(time)) {
            return res.json({
                available: false,
                message: 'This is lunch time! Doctor will be available after 01:00 PM.',
                type: 'lunch_time'
            });
        }

        res.json({ available: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Upsert schedule (Admin)
// @route   POST /api/schedules
// @access  Private (Admin)
export const upsertSchedule = async (req, res) => {
    try {
        const { dentistId, branchId, dayOfWeek, startTime, endTime, isGovHospitalDay } = req.body;

        let schedule = await Schedule.findOne({ dentistId, dayOfWeek });

        if (schedule) {
            schedule.branchId = branchId;
            schedule.startTime = startTime;
            schedule.endTime = endTime;
            schedule.isGovHospitalDay = isGovHospitalDay;
            await schedule.save();
        } else {
            schedule = await Schedule.create({ dentistId, branchId, dayOfWeek, startTime, endTime, isGovHospitalDay });
        }

        res.json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get available dentists for a branch and date
// @route   GET /api/schedules/available-dentists
// @access  Public
export const getAvailableDentists = async (req, res) => {
    try {
        const { branchId, date } = req.query;
        let query = { isGovHospitalDay: false };

        if (branchId) {
            query.branchId = branchId;
        }

        if (date && date !== 'undefined' && date !== '') {
            const dateObj = new Date(date);
            if (!isNaN(dateObj.getTime())) {
                const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                query.dayOfWeek = dayOfWeek;
            }
        }

        const schedules = await Schedule.find(query).distinct('dentistId');
        const dentists = await User.find({ _id: { $in: schedules }, role: 'dentist' }).select('-password').sort({ fullName: 1 });

        res.json(dentists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

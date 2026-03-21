import Notification from '../models/Notification.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification) {
            notification.status = 'read';
            await notification.save();
            res.json({ message: 'Notification marked as read' });
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        console.error('Update Notification Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a system notification (Internal use)
export const createNotification = async (userId, type, message, relatedId = null) => {
    try {
        await Notification.create({
            userId,
            type,
            message,
            relatedId
        });
    } catch (error) {
        console.error('Create Notification Error:', error);
    }
};

// @desc    Simulate sending SMS (e.g. via Twilio)
export const sendSMS = async (phone, message) => {
    try {
        console.log(`\n📱 [SMS SIMULATION] To: ${phone} | Message: "${message}"\n`);
        // TODO: Integrate actual SMS gateway here (Twilio, Nexmo, etc.)
        return true;
    } catch (error) {
        console.error('SMS Sending Error:', error);
        return false;
    }
};
// @desc    Send Email utility
export const sendEmail = async (email, subject, message) => {
    try {
        // Log locally for debugging
        console.log(`\n📧 [EMAIL SIMULATION] To: ${email} | Subject: "${subject}" | Message: "${message}"\n`);

        // Create a transporter (using a safe mock/console logger or real SMTP)
        // For a production-ready student project, we include the real setup code commented
        /*
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: message
        };

        await transporter.sendMail(mailOptions);
        */
        return true;
    } catch (error) {
        console.error('Email Sending Error:', error);
        return false;
    }
};

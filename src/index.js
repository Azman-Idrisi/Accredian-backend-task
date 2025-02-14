import express from 'express';
import validateReferralData from './controllers/validateData.js';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.use(express.json());
app.use(cors());

// Home Route
app.get('/', (req, res) => {
    res.json({ message: "Home" });
});

// Unified GET API
app.get('/referral', async (req, res) => {
    const { referrerName, referrerEmail, refereeName, refereeEmail, course } = req.query;

    // Step 1: Validate input data
    const validationError = validateReferralData(req.query);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        // Step 2: Store data in the database
        // const referral = await prisma.referral.create({
        //     data: { referrerName, referrerEmail, refereeName, refereeEmail, course },
        // });

        // Step 3: Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: refereeEmail, // Email sent to referee
            subject: `You've been referred for ${course}`,
            text: `Hello ${refereeName},\n\nYou have been referred by ${referrerName} for the ${course} course.\n\nBest regards,\nTeam`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Referral saved & email sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database or email error', details: error.message });
    }
});

// Start Server
app.listen(3000, () => {
    console.log("Server is running on PORT 3000");
});

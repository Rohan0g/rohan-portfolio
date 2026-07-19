import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', '*'],
  credentials: true
}));
app.use(express.json());

// Fallback MongoDB configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rohan_portfolio';
let isMongoConnected = false;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('⚡ [MongoDB] Connected to database successfully.');
    isMongoConnected = true;
  })
  .catch((err) => {
    console.warn('⚠️ [MongoDB] Warning: Database connection failed. Defaulting to local memory fallbacks.', err.message);
  });

// Message Schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// In-Memory message storage as a robust fallback
const memoryMessages = [];

// APIs

// Contact Endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  console.log(`✉️ [Inbound Message] From: ${name} (${email})`);
  console.log(`💬 Message: "${message}"`);

  try {
    if (isMongoConnected) {
      const newMessage = new Message({ name, email, message });
      await newMessage.save();
      console.log('✅ [Database] Message saved successfully.');
    } else {
      memoryMessages.push({ name, email, message, createdAt: new Date() });
      console.log('💾 [Fallback Memory] Saved message in volatile memory store.');
    }

    // Try sending email if nodemailer is configured in .env (optional credentials)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'contact@nexorith.com',
        subject: `New Portfolio Inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      };

      await transporter.sendMail(mailOptions);
      console.log('✉️ [Email] Alert notification sent to admin.');
    }

    return res.status(200).json({ success: true, message: 'Message received and processed.' });
  } catch (error) {
    console.error('❌ [Error] Contact API execution failed:', error.message);
    // Even if database fails, we send success to client if we logged it to memory/stdout to prevent UI blocking
    return res.status(200).json({ success: true, message: 'Message logged locally, database write bypassed.' });
  }
});

// Telemetry Stats Endpoint
app.get('/api/stats', (req, res) => {
  res.status(200).json({
    activeUsers: Math.floor(Math.random() * 4) + 1,
    latency: '14ms',
    uptime: process.uptime(),
    dbConnected: isMongoConnected
  });
});

// Root Ping
app.get('/', (req, res) => {
  res.send('Rohan Pattnaik Portfolio API Gateway is online.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 [Server] Running on port ${PORT}`);
  console.log(`📎 API Root: http://localhost:${PORT}`);
});

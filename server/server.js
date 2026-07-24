import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Fallback MongoDB configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rohan_portfolio';
let isMongoConnected = false;

if (process.env.MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('⚡ [MongoDB] Connected to database successfully.');
      isMongoConnected = true;
    })
    .catch((err) => {
      console.warn('⚠️ [MongoDB] Warning: Database connection failed. Defaulting to local memory fallbacks.', err.message);
    });
}

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
      console.log('💾 [Fallback Memory] Saved message in memory store.');
    }

    // Email Notification Alert System to Rohan Pattnaik (the.rohanpattnaik@gmail.com)
    const receiverEmail = process.env.NOTIFICATION_EMAIL || 'the.rohanpattnaik@gmail.com';
    const emailSender = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (emailSender && emailPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailSender,
          pass: emailPass
        }
      });

      const htmlContent = `
        <div style="background-color:#030712; color:#ffffff; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; padding:30px; border-radius:12px; border:1px solid #06B6D4;">
          <div style="text-align:center; margin-bottom:20px;">
            <h1 style="color:#06B6D4; margin:0; font-size:24px;">⚡ NEXORITH CLIENT INQUIRY</h1>
            <p style="color:#94A3B8; font-size:12px; margin-top:4px;">PORTFOLIO DISPATCH NOTIFICATION</p>
          </div>
          <div style="background-color:#0F172A; padding:20px; border-radius:8px; border-left:4px solid #3B82F6;">
            <p style="margin:0 0 10px 0; font-size:14px;"><strong style="color:#06B6D4;">Client Name:</strong> ${name}</p>
            <p style="margin:0 0 10px 0; font-size:14px;"><strong style="color:#06B6D4;">Client Email:</strong> <a href="mailto:${email}" style="color:#3B82F6;">${email}</a></p>
            <p style="margin:15px 0 5px 0; font-size:14px;"><strong style="color:#06B6D4;">Message Blueprint:</strong></p>
            <div style="background-color:#030712; padding:15px; border-radius:6px; font-size:13px; line-height:1.6; color:#E2E8F0; border:1px solid rgba(255,255,255,0.1);">
              ${message.replace(/\n/g, '<br/>')}
            </div>
          </div>
          <div style="margin-top:25px; text-align:center; font-size:10px; color:#64748B;">
            <p>Sent automatically from Rohan Pattnaik Portfolio System | Co-Founder Nexorith IT Solutions</p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `Nexorith Portfolio <${emailSender}>`,
        to: receiverEmail,
        replyTo: email,
        subject: `🚀 [CLIENT INQUIRY] New Message from ${name}`,
        text: `Client Name: ${name}\nClient Email: ${email}\n\nMessage:\n${message}`,
        html: htmlContent
      };

      await transporter.sendMail(mailOptions);
      console.log(`✉️ [Email Alert] Successfully sent to ${receiverEmail}`);
    } else {
      console.log('ℹ️ [Email System] EMAIL_USER / EMAIL_PASS env vars not set yet. Message logged safely.');
    }

    return res.status(200).json({ success: true, message: 'Message received and processed.' });
  } catch (error) {
    console.error('❌ [Error] Contact API execution failed:', error.message);
    return res.status(200).json({ success: true, message: 'Message logged locally.' });
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

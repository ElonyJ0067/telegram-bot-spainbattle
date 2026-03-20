const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Bot configuration
const token = process.env.TELEGRAM_BOT_TOKEN;
const url = process.env.WEBHOOK_URL; // Your deployment URL

// Create bot instance (webhook mode)
const bot = new TelegramBot(token);

// Set webhook
bot.setWebHook(`${url}/bot${token}`);

// Middleware
app.use(express.json());

// Store user interactions
const userInteractions = new Map();

// Auto-reply message
const AUTO_REPLY_MESSAGE = `Thank you for contacting us. We've received your message and will respond as soon as possible. In the meantime, feel free to explore our website for more information.`;

// Admin notification function
function notifyAdmin(userMessage, userInfo) {
    const adminId = process.env.ADMIN_TELEGRAM_ID;
    if (adminId) {
        const notification = `🔔 New message received:

From: ${userInfo.first_name} ${userInfo.last_name || ''} (@${userInfo.username || 'no username'})
User ID: ${userInfo.id}
Message: ${userMessage}

Reply directly to this chat to respond to the user.`;
        
        bot.sendMessage(adminId, notification);
    }
}

// Webhook endpoint
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Handle incoming messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userMessage = msg.text;
    const userInfo = msg.from;
    
    // Skip if message is from admin
    if (userId.toString() === process.env.ADMIN_TELEGRAM_ID) {
        return;
    }
    
    // Check if user already received auto-reply in last 24 hours
    const lastInteraction = userInteractions.get(userId);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (!lastInteraction || (now - lastInteraction) > twentyFourHours) {
        // Send auto-reply
        await bot.sendMessage(chatId, AUTO_REPLY_MESSAGE);
        
        // Update user interaction timestamp
        userInteractions.set(userId, now);
        
        console.log(`Auto-reply sent to user: ${userInfo.first_name} (@${userInfo.username})`);
    }
    
    // Notify admin about new message
    notifyAdmin(userMessage, userInfo);
    
    // Log the interaction
    console.log(`Message from ${userInfo.first_name} (@${userInfo.username}): ${userMessage}`);
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'Bot is running!', 
        bot: '@spinbattles320',
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`🤖 Telegram Bot webhook server running on port ${port}`);
    console.log('Bot username: @spinbattles320');
});
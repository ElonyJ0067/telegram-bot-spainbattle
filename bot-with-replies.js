const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Bot configuration
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Store user interactions and conversation context
const userInteractions = new Map();
const activeConversations = new Map(); // Store admin -> customer mapping

// Auto-reply message
const AUTO_REPLY_MESSAGE = "Thank you for contacting us. We've received your message and will respond as soon as possible. In the meantime, feel free to explore our website for more information.";

// Admin notification function with reply instructions
async function notifyAdmin(userMessage, userInfo) {
    const adminId = process.env.ADMIN_TELEGRAM_ID;
    if (!adminId) return;
    
    // Store the conversation context
    activeConversations.set(adminId, userInfo.id);
    
    const notification = `🔔 New message received:

From: ${userInfo.first_name} ${userInfo.last_name || ''} (@${userInfo.username || 'no username'})
User ID: ${userInfo.id}
Message: ${userMessage}

💬 Reply to this message and I'll send it to the customer!
📱 Or type /end to finish this conversation`;
    
    try {
        await bot.sendMessage(adminId, notification);
        console.log(`✅ Admin notification sent`);
    } catch (error) {
        if (error.code === 'ETELEGRAM' && error.response.body.error_code === 400) {
            console.log(`⚠️  Admin notification failed: You need to start a chat with the bot first from your main account (@spinbattles320)`);
        } else {
            console.log(`❌ Admin notification error:`, error.message);
        }
    }
}

// Handle incoming messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userMessage = msg.text || '[Media/File]';
    const userInfo = msg.from;
    
    // Handle admin messages (replies to customers)
    if (userId.toString() === process.env.ADMIN_TELEGRAM_ID) {
        console.log(`📝 Message from admin (you): ${userMessage}`);
        
        // Check for commands
        if (userMessage === '/end') {
            activeConversations.delete(userId);
            await bot.sendMessage(chatId, '✅ Conversation ended. Next customer message will start a new conversation.');
            return;
        }
        
        if (userMessage === '/status') {
            const activeCustomer = activeConversations.get(userId);
            if (activeCustomer) {
                await bot.sendMessage(chatId, `💬 Currently replying to customer ID: ${activeCustomer}\nType /end to finish this conversation.`);
            } else {
                await bot.sendMessage(chatId, '💤 No active conversation. Wait for a customer message to start replying.');
            }
            return;
        }
        
        // Forward admin message to active customer
        const activeCustomerId = activeConversations.get(userId);
        if (activeCustomerId) {
            try {
                await bot.sendMessage(activeCustomerId, userMessage);
                console.log(`✅ Your reply sent to customer ID: ${activeCustomerId}`);
                await bot.sendMessage(chatId, `✅ Message sent to customer!`);
            } catch (error) {
                console.log(`❌ Failed to send reply to customer:`, error.message);
                await bot.sendMessage(chatId, `❌ Failed to send message to customer. They may have blocked the bot.`);
            }
        } else {
            await bot.sendMessage(chatId, `💡 No active conversation. Wait for a customer message first, then reply to it.`);
        }
        return;
    }
    
    // Handle customer messages
    const lastInteraction = userInteractions.get(userId);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    let shouldSendAutoReply = false;
    
    if (!lastInteraction || (now - lastInteraction) > twentyFourHours) {
        shouldSendAutoReply = true;
        userInteractions.set(userId, now);
    }
    
    // Log the interaction
    console.log(`📨 Message from ${userInfo.first_name} (@${userInfo.username || 'no username'}): ${userMessage}`);
    
    if (shouldSendAutoReply) {
        try {
            await bot.sendMessage(chatId, AUTO_REPLY_MESSAGE);
            console.log(`✅ Auto-reply sent to ${userInfo.first_name}`);
        } catch (error) {
            console.error(`❌ Failed to send auto-reply:`, error.message);
        }
    } else {
        console.log(`ℹ️  No auto-reply sent to ${userInfo.first_name} (already replied in last 24h)`);
    }
    
    // Always notify admin about new messages
    await notifyAdmin(userMessage, userInfo);
});

// Handle bot startup and errors
bot.on('polling_error', (error) => {
    if (error.code === 'ETELEGRAM' && error.response.body.error_code === 409) {
        console.error('❌ CONFLICT ERROR: Another bot instance is running!');
        console.error('   Solution: Stop all other bot instances and try again.');
        process.exit(1);
    } else {
        console.error('❌ Polling error:', error.message);
    }
});

// Graceful shutdown
pr
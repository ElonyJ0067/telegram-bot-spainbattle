const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Bot configuration
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Store user interactions and conversation context
const userInteractions = new Map();
let lastCustomerId = null; // Store the last customer who messaged

// Auto-reply message
const AUTO_REPLY_MESSAGE = "Thank you for contacting us. We've received your message and will respond as soon as possible. In the meantime, feel free to explore our website for more information.";

// Admin notification function with reply instructions
async function notifyAdmin(userMessage, userInfo) {
    const adminId = process.env.ADMIN_TELEGRAM_ID;
    if (!adminId) return;
    
    // Store the last customer ID for replies
    lastCustomerId = userInfo.id;
    
    const notification = `🔔 New message received:

From: ${userInfo.first_name} ${userInfo.last_name || ''} (@${userInfo.username || 'no username'})
User ID: ${userInfo.id}
Message: ${userMessage}

💬 Your next message will be sent to this customer automatically!`;
    
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
        
        // Forward admin message to last customer
        if (lastCustomerId) {
            try {
                await bot.sendMessage(lastCustomerId, userMessage);
                console.log(`✅ Your reply sent to customer ID: ${lastCustomerId}`);
            } catch (error) {
                console.log(`❌ Failed to send reply to customer:`, error.message);
            }
        } else {
            console.log(`💡 No recent customer to reply to. Wait for a customer message first.`);
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
process.on('SIGINT', () => {
    console.log('\n🛑 Bot shutting down gracefully...');
    bot.stopPolling();
    process.exit(0);
});

console.log('🤖 SpinBattles Auto-Reply Bot is running...');
console.log('📱 Bot username: @spinbattles320Bot');
console.log('🌐 Website: https://spinbattles.com/');
console.log('💬 Ready to handle customer messages!');
console.log('\n📋 How it works:');
console.log('   1. Customer messages the bot → Gets auto-reply');
console.log('   2. You get notification with customer details');
console.log('   3. Your next message automatically goes to that customer');
console.log('   4. Simple and seamless!');
console.log('\n🔄 Waiting for messages...\n');
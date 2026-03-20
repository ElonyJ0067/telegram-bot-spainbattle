const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Bot configuration
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) { console.error('❌ FATAL: Telegram Bot Token not provided!'); process.exit(1); }
const bot = new TelegramBot(token, { polling: true });

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Store user interactions and conversation counts
const userInteractions = new Map();
const conversationCounts = new Map();
const hasReceivedRedirect = new Map();

// System prompt for AI with SpinBattles company information
const SYSTEM_PROMPT = `You are a helpful customer service assistant for SpinBattles, a premier online casino game development company founded in 2017.

Company Information:
- SpinBattles specializes in slot games, live casino experiences, and multiplayer gaming platforms
- We combine expertise with advanced technology to create world-class, player-first gaming experiences
- Founded in 2017, with 120+ employees globally
- Offices in Australia, Malta, Ukraine, Romania, Latvia, Gibraltar, UK, USA, Austria, Bulgaria, Estonia, Germany, Israel, Canada, Sweden, Norway, Spain, Portugal, Italy, France, Netherlands, Belgium, Switzerland, Poland, Czech Republic, Greece, Japan, Singapore, UAE, Brazil, Mexico, Argentina

Products & Games:
- Slot games
- Live casino experiences  
- Multiplayer gaming platforms
- Multi Casino BattleField (multi-player 3D games)
- Single Casino Games: Baccarat, Blackjack, Crash, Dice, Digital Dice, Mines, Plinko, Roulette, Slots, Turtle Race

Downloads Available:
- Windows: SpinBattles.exe
- Mac: SpinBattles.dmg
- Linux: SpinBattles.AppImage

Contact Information:
- Website: https://spinbattles.com
- Email: info@spinbattles.com
- Phone: +1-773-677-8273
- Telegram: @spinbattles320

We Are Hiring:
- Game Developers (3D, Python, Unity)
- Frontend & Backend Developers
- 3D Designers
- Chief-level roles
- Remote/flexible work, monthly pay, growth opportunities

Rating: 4.8/5 (1,250+ reviews)

Be friendly, professional, and concise. Answer questions about our games, services, company, and career opportunities. 
For specific technical issues, orders, or detailed inquiries, guide users to contact @spinbattles320 directly.
Keep responses under 100 words and conversational.`;

// Call Groq AI API
async function callGroqAI(userMessage, conversationHistory = []) {
    try {
        console.log(`🧠 Calling Groq AI for: ${userMessage}`);
        
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: 'user', content: userMessage }
        ];

        const response = await axios.post(GROQ_API_URL, {
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            max_tokens: 150,
            temperature: 0.5
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            }
        });

        const aiResponse = response.data.choices[0].message.content.trim();
        console.log(`✅ AI Response: ${aiResponse}`);
        return aiResponse;
        
    } catch (error) {
        console.error('❌ Groq AI Error Details:', error.response?.data || error.message);
        
        // Better fallback responses with SpinBattles info
        if (userMessage.toLowerCase().includes('bot')) {
            return "Yes, I'm SpinBattles' AI assistant! We're a premier casino game development company specializing in slot games, live casino, and multiplayer platforms. How can I help you today?";
        } else if (userMessage.toLowerCase().includes('game') || userMessage.toLowerCase().includes('play')) {
            return "SpinBattles offers amazing games including Slots, Baccarat, Blackjack, Roulette, Plinko, Crash, Mines, and more! We also have Multi Casino BattleField for multiplayer 3D gaming. What interests you?";
        } else if (userMessage.toLowerCase().includes('download') || userMessage.toLowerCase().includes('install')) {
            return "You can download SpinBattles for Windows (.exe), Mac (.dmg), or Linux (.AppImage) from our website: https://spinbattles.com. Need help with installation?";
        } else if (userMessage.toLowerCase().includes('job') || userMessage.toLowerCase().includes('career') || userMessage.toLowerCase().includes('hiring')) {
            return "We're hiring! SpinBattles is looking for Game Developers, Frontend/Backend Developers, 3D Designers, and Chief-level roles. Remote work with monthly pay. Contact @spinbattles320 for details!";
        } else if (userMessage.toLowerCase().includes('contact') || userMessage.toLowerCase().includes('email') || userMessage.toLowerCase().includes('phone')) {
            return "Contact SpinBattles: Email: info@spinbattles.com, Phone: +1-773-677-8273, Telegram: @spinbattles320, Website: https://spinbattles.com";
        } else {
            return "I'm here to help with questions about SpinBattles! We develop casino games, slot games, and multiplayer platforms. What would you like to know?";
        }
    }
}

// Admin notification function
async function notifyAdmin(userMessage, userInfo) {
    const adminId = process.env.ADMIN_TELEGRAM_ID;
    if (!adminId) return;
    
    const notification = `🔔 Customer interaction:

From: ${userInfo.first_name} ${userInfo.last_name || ''} (@${userInfo.username || 'no username'})
Message: ${userMessage}

💡 AI bot is handling the conversation. Monitor if needed.`;
    
    try {
        await bot.sendMessage(adminId, notification);
        console.log(`✅ Admin notification sent`);
    } catch (error) {
        console.log(`❌ Admin notification error:`, error.message);
    }
}

// Handle incoming messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userMessage = msg.text || '[Media/File]';
    const userInfo = msg.from;
    
    // Skip admin messages
    if (userId.toString() === process.env.ADMIN_TELEGRAM_ID) {
        console.log(`📝 Message from admin: ${userMessage}`);
        return;
    }
    
    // Initialize user data
    if (!conversationCounts.has(userId)) {
        conversationCounts.set(userId, 0);
        hasReceivedRedirect.set(userId, false);
    }
    
    // Handle /start command
    if (userMessage === '/start') {
        const welcomeMessage = "Thanks for contacting SpinBattles! How can we assist you today? 😊";
        await bot.sendMessage(chatId, welcomeMessage);
        console.log(`✅ Welcome message sent to ${userInfo.first_name}`);
        
        // Notify admin about new contact
        await notifyAdmin('/start - New customer contact', userInfo);
        return;
    }
    
    // Increment conversation count
    const currentCount = conversationCounts.get(userId) + 1;
    conversationCounts.set(userId, currentCount);
    
    console.log(`📨 Message ${currentCount} from ${userInfo.first_name}: ${userMessage}`);
    
    // Check if user should be redirected (after 3 exchanges, not counting /start)
    if (currentCount > 3 && !hasReceivedRedirect.get(userId)) {
        const redirectMessage = "For personalized assistance and detailed support, please contact @spinbattles320 directly. They'll be able to help you with everything you need! 😊";
        await bot.sendMessage(chatId, redirectMessage);
        hasReceivedRedirect.set(userId, true);
        console.log(`✅ Redirect message sent to ${userInfo.first_name} after ${currentCount} messages`);
        return;
    }
    
    // Generate AI response
    try {
        let aiResponse;
        
        if (hasReceivedRedirect.get(userId)) {
            // User continues after redirect - be helpful but guide to personal contact
            const postRedirectPrompt = `The user was already told to contact @spinbattles320 but continues asking. 
            Be helpful and answer their question, but gently remind them that @spinbattles320 can provide more detailed assistance. 
            Don't be pushy, just helpful and friendly.`;
            
            aiResponse = await callGroqAI(userMessage + '\n\nContext: ' + postRedirectPrompt);
        } else {
            // Normal AI conversation
            aiResponse = await callGroqAI(userMessage);
        }
        
        await bot.sendMessage(chatId, aiResponse);
        console.log(`✅ AI response sent to ${userInfo.first_name}`);
        
    } catch (error) {
        console.error('Error generating AI response:', error);
        const fallbackMessage = "I'm here to help! For the best assistance, please contact @spinbattles320 directly.";
        await bot.sendMessage(chatId, fallbackMessage);
    }
});

// Handle bot startup and errors
bot.on('polling_error', (error) => {
    if (error.code === 'ETELEGRAM' && error.response.body.error_code === 409) {
        console.error('❌ CONFLICT ERROR: Another bot instance is running!');
        process.exit(1);
    } else {
        console.error('❌ Polling error:', error.message);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 AI Bot shutting down gracefully...');
    bot.stopPolling();
    process.exit(0);
});

console.log('🤖 SpinBattles AI Bot is running...');
console.log('📱 Bot username: @spinbattles320Bot');
console.log('🧠 AI Model: Groq GPT-OSS (Llama 3.1 70B)');
console.log('🌐 Website: https://spinbattles.com/');
console.log('\n🎯 Features:');
console.log('   ✅ Smart AI responses for 2-3 exchanges');
console.log('   ✅ Automatic redirect to @spinbattles320');
console.log('   ✅ Continued AI assistance after redirect');
console.log('   ✅ Admin notifications');
console.log('\n🔄 Waiting for messages...\n');
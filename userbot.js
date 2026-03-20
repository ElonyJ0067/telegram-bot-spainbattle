const { TelegramApi } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
require('dotenv').config();

// Your Telegram API credentials (get from https://my.telegram.org)
const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.SESSION_STRING || '');

// Store users who already received auto-reply
const repliedUsers = new Set();

// Auto-reply message
const AUTO_REPLY_MESSAGE = "Thank you for contacting us. We've received your message and will respond as soon as possible. In the meantime, feel free to explore our website for more information.";

async function startUserBot() {
    console.log('🚀 Starting Telegram UserBot...');
    
    const client = new TelegramApi(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await input.text('Enter your phone number: '),
        password: async () => await input.text('Enter your password: '),
        phoneCode: async () => await input.text('Enter the code you received: '),
        onError: (err) => console.log(err),
    });

    console.log('✅ UserBot connected successfully!');
    console.log('Session string:', client.session.save());
    console.log('Save this session string to your .env file as SESSION_STRING');

    // Listen for new messages
    client.addEventHandler(async (update) => {
        if (update.className === 'UpdateNewMessage') {
            const message = update.message;
            
            // Skip if it's our own message or a group message
            if (message.out || message.peerId.className !== 'PeerUser') {
                return;
            }

            const userId = message.peerId.userId.toString();
            const messageText = message.message;
            
            // Get sender info
            const sender = await client.getEntity(message.peerId);
            const senderName = sender.firstName + (sender.lastName ? ` ${sender.lastName}` : '');
            
            console.log(`📨 New message from ${senderName} (@${sender.username || 'no username'}): ${messageText}`);
            
            // Send auto-reply only if this user hasn't received one before
            if (!repliedUsers.has(userId)) {
                try {
                    await client.sendMessage(message.peerId, {
                        message: AUTO_REPLY_MESSAGE
                    });
                    
                    repliedUsers.add(userId);
                    console.log(`✅ Auto-reply sent to ${senderName}`);
                } catch (error) {
                    console.error('❌ Failed to send auto-reply:', error);
                }
            } else {
                console.log(`ℹ️  No auto-reply sent to ${senderName} (already replied before)`);
            }
        }
    });

    console.log('🤖 UserBot is now listening for messages...');
    console.log('Send a message to your account to test!');
}

startUserBot().catch(console.error);
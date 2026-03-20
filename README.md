# 🤖 SpinBattles Telegram Auto-Reply Bot

Professional auto-reply bot for instant customer support via Telegram.

## ✨ Features

- ✅ **Instant Auto-Replies** - Customers get immediate responses
- ✅ **Smart Cooldown** - Only auto-replies once per 24 hours per user
- ✅ **Admin Notifications** - Get notified of every customer message
- ✅ **Professional Design** - Clean, business-ready interface
- ✅ **Easy Integration** - Simple website button integration
- ✅ **Free Forever** - No subscription fees or limits

## 🚀 Quick Start

### 1. Start the Bot
```bash
# Option 1: Command line
npm start

# Option 2: Double-click (Windows)
start.bat
```

### 2. Enable Notifications
- Message @spinbattles320Bot from your main account (@spinbattles320)
- Send any message to establish the connection

### 3. Add to Website
```html
<a href="https://t.me/spinbattles320Bot" target="_blank">
   💬 Get Instant Support
</a>
```

## 📱 Bot Information

- **Bot Username:** @spinbattles320Bot
- **Website:** https://spinbattles.com/
- **Auto-Reply Message:** "Thank you for contacting us. We've received your message and will respond as soon as possible. In the meantime, feel free to explore our website for more information."

## 🔧 Configuration

All settings are in `.env` file:

```env
TELEGRAM_BOT_TOKEN=8545726801:AAHE01XJqDB9cTpsHLQVz-5CzT99j_wZu6E
ADMIN_TELEGRAM_ID=8725096134
WEBSITE_URL=https://spinbattles.com/
```

## 📋 How It Works

1. **Customer Journey:**
   - Clicks Telegram button on your website
   - Opens @spinbattles320Bot
   - Clicks "START" button
   - Gets instant auto-reply
   - Can continue conversation

2. **Your Workflow:**
   - Get notification on your phone
   - Open @spinbattles320Bot
   - Reply as the bot
   - Professional customer service

## 🎨 Website Integration

See `website-integration.html` for:
- Live demo button
- Copy-paste code snippets
- Styling examples
- Integration guide

## 🛠️ Troubleshooting

### Bot Not Responding
- Check if bot is running: `npm start`
- Verify token in `.env` file
- Make sure only ONE instance is running

### No Admin Notifications
- Message the bot from @spinbattles320 first
- Check ADMIN_TELEGRAM_ID in `.env`
- Restart the bot after changes

### Conflict Error (409)
- Stop all bot instances: `Ctrl+C`
- Wait 30 seconds
- Start only one instance: `npm start`

## 📊 Bot Logs

The bot provides detailed logging:
- ✅ Auto-replies sent
- 📨 Messages received
- ⚠️ Notifications status
- ❌ Error handling

## 🔒 Security

- Bot token is secure in `.env` file
- Admin ID verification prevents unauthorized access
- No sensitive data stored
- Professional error handling

## 🌐 Deployment Options

### Local (Current Setup)
- Run on your computer
- Perfect for testing and small businesses

### Cloud Deployment (Optional)
- Railway: Free tier available
- Render: Free tier available
- Vercel: Use webhook version

## 📞 Support

Your professional Telegram auto-reply system is ready!

**Bot:** @spinbattles320Bot  
**Website:** https://spinbattles.com/  
**Status:** ✅ Active and Ready
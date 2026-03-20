# 🚀 Railway Deployment Guide

Deploy your SpinBattles AI Telegram Bot to Railway (FREE!)

## ✅ **Prerequisites:**
- GitHub account
- Railway account (sign up at https://railway.app)
- Your bot is ready in this folder

## 📝 **Step-by-Step Deployment:**

### **1. Push Code to GitHub**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "SpinBattles AI Telegram Bot"

# Create GitHub repo and push
# (Follow GitHub instructions to create new repo)
git remote add origin https://github.com/YOUR_USERNAME/spinbattles-bot.git
git branch -M main
git push -u origin main
```

### **2. Deploy to Railway**

1. **Go to https://railway.app**
2. **Click "Start a New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your repository** (spinbattles-bot)
5. **Railway will auto-detect Node.js** ✅

### **3. Add Environment Variables**

In Railway dashboard, go to **Variables** tab and add:

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
ADMIN_TELEGRAM_ID=your_admin_telegram_id
WEBSITE_URL=https://spinbattles.com/
GROQ_API_KEY=your_groq_api_key_here
```

### **4. Deploy!**

Railway will automatically:
- ✅ Install dependencies (`npm install`)
- ✅ Start your bot (`npm start`)
- ✅ Keep it running 24/7
- ✅ Auto-restart on crashes

### **5. Monitor Your Bot**

In Railway dashboard:
- **Logs** - See bot activity in real-time
- **Metrics** - Monitor CPU/Memory usage
- **Deployments** - View deployment history

## 🎯 **After Deployment:**

Your bot will be running 24/7 on Railway's servers where:
- ✅ **Groq API will work** (no firewall issues)
- ✅ **Always online** (even when your PC is off)
- ✅ **Auto-restarts** if it crashes
- ✅ **Free tier** is generous for bots

## 🔧 **Updating Your Bot:**

Just push changes to GitHub:
```bash
git add .
git commit -m "Update bot"
git push
```

Railway auto-deploys! 🚀

## 💰 **Railway Free Tier:**

- **$5 free credits per month**
- **500 hours execution time**
- **Perfect for Telegram bots**
- **No credit card required initially**

## ✅ **Your Bot is Ready!**

Once deployed:
1. Check Railway logs to confirm bot started
2. Test by messaging @spinbattles320Bot
3. Enjoy your 24/7 AI-powered customer service!

## 🆘 **Troubleshooting:**

**Bot not starting?**
- Check Railway logs for errors
- Verify environment variables are set
- Make sure all dependencies are in package.json

**Groq API still not working?**
- Check GROQ_API_KEY is correct
- Verify API key is active in Groq console
- Check Railway logs for specific errors

**Need help?**
- Railway has great documentation
- Check Railway community Discord
- Review deployment logs carefully

---

**Your SpinBattles AI Bot will be live and working perfectly on Railway! 🎉**
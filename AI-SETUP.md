# 🤖 AI-Powered Telegram Bot Setup

Perfect implementation of your smart bot idea with Groq AI!

## 🎯 **How It Works:**

1. **Customer:** `/start`
2. **AI Bot:** "Thanks for contacting SpinBattles! How can we assist you today? 😊"
3. **Customer:** "What services do you offer?"
4. **AI Bot:** *[Smart AI response using Groq GPT-OSS]*
5. **Customer:** "How much does it cost?"
6. **AI Bot:** *[Another intelligent response]*
7. **Customer:** "I want to place an order"
8. **AI Bot:** "For personalized assistance, please contact @spinbattles320 directly!"
9. **Customer:** "But I want to ask here..."
10. **AI Bot:** *[Continues helping smartly while guiding to personal contact]*

## 🚀 **Setup Instructions:**

### 1. Get Groq API Key
1. Go to https://console.groq.com/
2. Sign up for free account
3. Create API key
4. Copy the key

### 2. Add API Key to .env
```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run AI Bot
```bash
npm run ai
```

## ✨ **Features Implemented:**

✅ **Smart AI Responses** - Uses Groq's fast LLM  
✅ **2-3 Exchange Limit** - Then redirects to @spinbattles320  
✅ **Intelligent Continuation** - Handles messages after redirect  
✅ **Admin Notifications** - You get notified of interactions  
✅ **Professional Tone** - Business-appropriate responses  
✅ **Fast Performance** - Groq provides sub-second responses  

## 🧠 **AI Behavior:**

**Before Redirect (Messages 1-2):**
- Answers questions intelligently
- Provides helpful information
- Professional and friendly tone

**Redirect Message (Message 3):**
- "For personalized assistance, please contact @spinbattles320"

**After Redirect (Message 4+):**
- Continues being helpful
- Answers what it can
- Gently guides to personal contact
- Never pushy or repetitive

## 📊 **Example Conversations:**

### **Conversation 1:**
- Customer: "What do you sell?"
- AI: "We offer premium gaming services and digital products..."
- Customer: "What are your prices?"
- AI: "Our pricing varies by service. Basic plans start at..."
- Customer: "I want to buy something"
- AI: "For personalized assistance, please contact @spinbattles320!"

### **Conversation 2 (After Redirect):**
- Customer: "I don't want to contact another account"
- AI: "I understand! I can help with general questions. What would you like to know? For detailed orders and support, @spinbattles320 provides the best service."

## 🎯 **Perfect Implementation:**

Your idea is now perfectly implemented:
- ✅ Smart AI responses for initial questions
- ✅ Automatic redirect after 2-3 exchanges  
- ✅ Continued intelligent assistance
- ✅ Professional customer experience
- ✅ Efficient routing to your personal account

## 🔧 **Commands:**

```bash
npm run ai      # Start AI bot
npm start       # Start basic bot
npm run dev     # Development mode
```

**Your AI-powered customer service bot is ready! 🚀**
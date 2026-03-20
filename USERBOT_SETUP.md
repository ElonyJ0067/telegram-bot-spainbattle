# UserBot Setup - Auto-reply on YOUR Personal Account

This will make YOUR account @Spinbattles320 auto-reply to first messages.

## Step 1: Get Telegram API Credentials

1. Go to https://my.telegram.org
2. Login with your phone number
3. Click "API Development Tools"
4. Create a new application:
   - App title: "SpinBattles AutoReply"
   - Short name: "spinbattles"
   - Platform: "Desktop"
5. Copy your `api_id` and `api_hash`

## Step 2: Update .env file

Add these to your `.env` file:
```
API_ID=your_api_id_number
API_HASH=your_api_hash_string
SESSION_STRING=
```

## Step 3: Install dependencies and run

```bash
npm install
npm run userbot
```

## Step 4: Login process

1. Enter your phone number (with country code, like +1234567890)
2. Enter the verification code from Telegram
3. If you have 2FA, enter your password
4. Copy the session string and add it to your .env file

## Step 5: Test

1. Ask someone to message your @Spinbattles320 account
2. They should get auto-reply on first message
3. No auto-reply on subsequent messages

## How it works

- ✅ Works on YOUR personal account @Spinbattles320
- ✅ Auto-reply only on FIRST message from each user
- ✅ You handle all follow-up messages manually
- ✅ Completely FREE
- ✅ No separate bot account needed

## Important Notes

- Keep your API credentials secure
- The session string allows access to your account
- Only run this on trusted computers
- You can revoke access anytime from Telegram settings
import telebot
from telebot import types
import threading
from flask import Flask
import time

# ======================================== -->
# APEX DAY BOT CONFIG
# ======================================== -->
API_TOKEN = '8475961508:AAHKi5QNRlMd2lTC1IbQNN2dY1velwYqwCY'
ADMIN_ID = 6362212726
WEB_APP_URL = 'https://apex-day-app.github.io/apex-day-app/'

bot = telebot.TeleBot(API_TOKEN)
app = Flask(__name__)

@app.route('/')
def home():
    return "🤖 APEX DAY BOT IS RUNNING 24/7!"

@bot.message_handler(commands=['start'])
def send_welcome(message):
    user_name = message.from_user.first_name
    
    welcome_text = f"""
╔══════════════════════════════╗
║        🎮 APEX DAY 🎮        ║
╚══════════════════════════════╝

✨ WELCOME, {user_name}! ✨

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎁 YOUR FREE BONUS 🎁
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Starting Balance: ₹1000 FREE!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👇 PLAY NOW 👇
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
    
    markup = types.InlineKeyboardMarkup()
    play_btn = types.InlineKeyboardButton(
        "🎮 CLICK TO PLAY NOW! 🎮", 
        web_app=types.WebAppInfo(WEB_APP_URL)
    )
    markup.add(play_btn)
    
    bot.send_message(message.chat.id, welcome_text, parse_mode='Markdown')
    bot.send_message(message.chat.id, "👇 Click below 👇", reply_markup=markup)

def run_bot():
    while True:
        try:
            bot.infinity_polling()
        except:
            time.sleep(5)

threading.Thread(target=run_bot).start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

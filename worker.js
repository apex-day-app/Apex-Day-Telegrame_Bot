// Telegram Bot for Cloudflare Workers
// Welcome message bot for @APEX_DAY_bot

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Only accept POST requests from Telegram
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      // Parse the incoming update from Telegram
      const update = await request.json();
      
      // Log for debugging (optional)
      console.log("Update received:", JSON.stringify(update));

      // Handle /start command
      if (update.message && update.message.text === "/start") {
        await handleStartCommand(update.message, env);
      }
      
      // Handle any other message (optional)
      else if (update.message && !update.message.text?.startsWith("/")) {
        // You can add custom replies here if needed
      }

      // Always return OK to Telegram
      return new Response("OK", {
        headers: { 
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*"
        }
      });
      
    } catch (error) {
      console.error("Error processing request:", error);
      return new Response("Error: " + error.message, { status: 500 });
    }
  }
};

/**
 * Handle /start command - Send welcome message
 */
async function handleStartCommand(message, env) {
  const chatId = message.chat.id;
  const firstName = message.from.first_name || "User";
  const lastName = message.from.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const username = message.from.username || "";
  
  // Welcome message with personalization
  const welcomeText = `Namaste ${firstName}! 🙏

✨ Aapka swagat hai mere bot mein!

Ye bot aapki seva ke liye tayyar hai. 
Kripya niche diye gaye commands ka upyog karein:

• /help - Sahayata prapt karein
• /about - Jaankari prapt karein

Dhanyavaad! 🌟`;

  // Send message to Telegram API
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: welcomeText,
      parse_mode: "HTML", // or "Markdown"
    }),
  });

  // Check if message was sent successfully
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Telegram API error:", errorData);
    throw new Error(`Telegram API error: ${response.status}`);
  }

  return await response.json();
}

// Optional: Handle help command
async function handleHelpCommand(chatId, env) {
  const helpText = `📚 <b>Sahayata</b>

Yahan kuch upyogi commands hain:

/start - Swagat sandesh
/help - Yeh sahayata sandesh
/about - Bot ki jaankari

Kisi bhi samay madad ke liye yahan message karein.`;

  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: helpText,
      parse_mode: "HTML"
    }),
  });
}

// Optional: Handle about command
async function handleAboutCommand(chatId, env) {
  const aboutText = `ℹ️ <b>Bot ki jaankari</b>

Naam: @APEX_DAY_bot
Version: 1.0
Language: JavaScript (Cloudflare Workers)

Ye ek simple welcome bot hai jo aapka swagat karta hai.`;

  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: aboutText,
      parse_mode: "HTML"
    }),
  });
}

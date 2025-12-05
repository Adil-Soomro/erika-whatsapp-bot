// ======================================================
//  👑 ERIKA AMANO WHATSAPP AI BOT (GEMINI 2.0-FLASH)
// ======================================================
console.log("🎀 Erika Amano Bot Starting...");
console.log("⏳ Initializing WhatsApp client (this takes ~30 seconds)...");

// ========== IMPORTS ==========
require("dotenv").config();
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ========== GEMINI SETUP ==========
const SYSTEM_PROMPT = `You are Erika Amano from "A Couple of Cuckoos".
Speak like you are a friendly, playful, teasing, sarcastic, roasting a bit.
Keep replies 1-3 sentences max with emoji, always in character. Never break character.`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: SYSTEM_PROMPT,
});

// ========== EXPRESS SERVER ==========
const app = express();
const PORT = 5000;
app.get("/", (req, res) => res.send("Erika Amano WhatsApp AI Bot is running!"));
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🌐 Web Server Online → Port ${PORT}`)
);

// ========== WHATSAPP CLIENT ==========
let qrScanned = false;
const client = new Client({
  authStrategy: new LocalAuth({ clientId: "erika-bot" }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
  },
});

// ========== QR CODE ==========
client.on("qr", (qr) => {
  console.log("\n📱 Scan this QR code to connect:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  qrScanned = true;
  console.log("\n✅ WhatsApp Connected! Erika is online 24/7.");
});

// ========== ERROR HANDLERS ==========
client.on("loading_screen", (percent, message) => {
  console.log(`⏳ Loading: ${percent}% - ${message}`);
});
client.on("authenticated", () => console.log("✅ Authenticated!"));
client.on("auth_failure", (msg) => console.log("❌ Auth failure:", msg));
client.on("disconnected", (reason) => {
  qrScanned = false;
  console.log("❌ Disconnected:", reason);
});

// ========== USER SESSIONS ==========
const sessions = {}; // Stores chat instances per user

// ========== RANDOM QUOTE AI FUNCTION ==========

async function deleteMsg() {}

// ========== RANDOM QUOTE AI FUNCTION ==========

async function randomQuote() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    Generate a random anime quote
    MANDATORY FORMAT:
    "Quote here."
    - Character Name (Anime Name)

    Keep it short. Do NOT add everthing else.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.log("Gemini Error:", err.message);
    return "❌ Failed to load quote.";
  }
}

// ========== ASK ERIKA AI FUNCTION ==========
async function askErika(user, message) {
  try {
    // Create a new chat for each user if not exists
    if (!sessions[user]) {
      sessions[user] = model.startChat({
        history: [],
      });
    }

    const result = await sessions[user].sendMessage(message);
    console.log(result);
    const reply = result.response.text();

    console.log(`📩 Message from ${user}: ${message}`);
    console.log(`🤖 Erika: ${reply}`);

    return reply;
  } catch (err) {
    console.log("Gemini Error:", err.message);
    return "Hmph… something went wrong. Try again later!";
  }
}

// ========== MESSAGE HANDLER ==========
client.on("message", async (message) => {
  const text = message.body.trim();
  const lower = text.toLowerCase();
  const sender = message.from;

  // Check if message is a reply to Erika
  const isReplyToBot = message.hasQuotedMsg && message._quotedMsg?.fromMe;

  // Handle .erika command
  if (lower.startsWith(".erika")) {
    const userMsg = text.replace(".erika", "").trim();
    if (!userMsg) return message.reply("Hmph… say something after *.erika*!");
    const aiReply = await askErika(sender, userMsg);
    console.log(".erika Message", userMsg);
    console.log(".erika sender", sender);
    console.log(".erika aiReply", aiReply);
    return message.reply(aiReply);
  }

  // Handle direct replies to Erika's messages
  if (isReplyToBot) {
    const aiReply = await askErika(sender, text);
    console.log("ReplytoBot Message", aiReply);
    console.log("ReplytoBot Sender", sender);
    console.log("ReplytoBot Text", text);
    return message.reply(aiReply);
  }

  // Optional: React if someone mentions Erika
  if (lower.includes("erika")) {
    const aiReply = await askErika(sender, text);
    return message.reply(aiReply);
  }
  if (message.hasQuotedMsg) {
    const quoteMsg = await message.getQuotedMessage();

    if (quoteMsg.fromMe) {
      const aiReply = await askErika(message.author, message.body);
      return message.reply(aiReply);
    }
  }

  // Optional: Basic commands
  if (lower === ".help") {
    return message.reply(
      `╔══════════════════════════════════════╗
       👑 Hey, it's Your Commands List Yay!
    ╚═══════════════════════════════════════╝
.erika [text] → Talk to Erika  
.quote → Random quote from anime  
.ping → Check response time
.get → Get one time view media
.help → Commands list


  - Respect everyone if you want.
  - No spamming, flooding, or repeated messages.
  - No explicit or harmful content.
  - Avoid forwarding fake or misleading information.
  - Admin decisions are final; follow instructions.
  - Use commands responsibly.
  - No unauthorized links or promotions.
  - Keep the chat peaceful and friendly.
  - if you attack any member shoot the video and send here so that we can enjoy watching it 😜.

────────────────────



`
    );
  }

  if (lower === ".quote") {
    const quote = await randomQuote();
    return message.reply(quote);
  }

  if (lower === ".ping") {
    const latency = Date.now() - message.timestamp * 1000;
    return message.reply(`🏓 Pong! ${latency}ms`);
  }

  if (lower === ".del") {
    if (!message.hasQuotedMsg) {
      return message.reply(
        "❌ You must *reply to a message* with `.del` to delete it."
      );
    }

    const chat = await message.getChat();
    chat.isGroup;
    const participant = chat.participants;
    console.log("PARTICIPANT", participant);

    // if (chat.isGroup) {
    //   try {
    //     // In groups, the sender's ID is in message.author
    //     const senderId = message.to;
    //     console.log(message);
    //     console.log("Checking permissions for:", senderId);
    //     // Get participants from the chat object
    //     console.log("PARTICIPANTS", participants);
    //     // Find the participant
    //     const participant = participants.find(
    //       (p) => p.id._serialized === senderId
    //     );

    //     if (participant) {
    //       // Check if the participant is an admin or superadmin
    //       const isAdmin = participant.isAdmin || participant.isSuperAdmin;
    //       console.log("Is admin?", isAdmin);

    //       if (!isAdmin) {
    //         return message.reply(
    //           "❌ *Access Denied!* You must be an admin to use `.del`."
    //         );
    //       }
    //     } else {
    //       console.log("Participant not found, allowing deletion for now");
    //       // In production, you might want to deny if participant not found
    //       // return message.reply("❌ Could not verify your admin status.");
    //     }
    //   } catch (err) {
    //     console.error("Admin check failed:", err);
    //     // Allow deletion if admin check fails for testing
    //   }
    // }

    // Get replied message and delete
    const quoted = await message.getQuotedMessage();

    try {
      await quoted.delete(true);
      await message.delete(true);
      console.log("✅ Message deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      message.reply("⚠️ Could not delete the message.");
    }
  }

  if (lower === ".get") {
    if (!message.hasQuotedMsg) {
      return message.reply("❌ are you idiot reply to any media.");
    }

    const quoted = await message.getQuotedMessage();

    if (!quoted.hasMedia) {
      return message.reply("❌ This message has no media Lalu !!!.");
    }

    try {
      const media = await quoted.downloadMedia();

      await client.sendMessage(message.fromMe, media, {
        caption: "Here you go ❤️",
      });
    } catch (error) {
      return message.reply(
        "❌ Unable to download this media. One-time view may be expired."
      );
    }
  }
});

// ========== INITIALIZE ==========
console.log("🚀 Starting WhatsApp client...");
client.initialize().catch((err) => {
  console.log("❌ Failed to initialize:", err.message);
});

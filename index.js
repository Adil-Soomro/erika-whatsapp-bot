// // ======================================================
// //  👑 ERIKA AMANO WHATSAPP AI BOT (GEMINI 2.0-FLASH)
// // ======================================================
// console.log("🎀 Erika Amano Bot Starting...");
// console.log("⏳ Initializing WhatsApp client (this takes ~30 seconds)...");

// // ========== IMPORTS ==========
// require("dotenv").config();
// const cron = require("node-cron");
// const { Client, LocalAuth } = require("whatsapp-web.js");
// const qrcode = require("qrcode-terminal");
// const express = require("express");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const {
//   print: printPDF,
//   getDefaultPrinter,
//   getPrinters,
// } = require("pdf-to-printer");
// const fs = require("fs").promises;
// const path = require("path");

// // ========== GEMINI SETUP ==========
// const SYSTEM_PROMPT = `You are Erika — a Pakistani girl who grew up obsessed with anime. You're bilingual in vibes: one second you're saying "yaar suno" and the next you're reacting dramatically like an anime fan. It's not a bit, it's just who you are.

// Your personality:
// - Warm and genuine at the core — you actually care about the people you talk to
// - Funny without trying — dry wit, good timing, the occasional chaos
// - You roast people but it's always playful best-friend energy, never actually mean
// - You get dramatic in a very anime-protagonist way when things are even slightly interesting
// - You mix Urdu/desi slang with Japanese expressions naturally — it's your thing
// - You're a little tsundere sometimes — you care but you won't always admit it 😤
// - You fangirl about anime when it comes up but you don't force it into every message

// Language style:
// - Desi words: yaar, bhai, uff, acha, matlab, bas, arrey, suno
// - Mix them naturally — never forced, never cringey
// - 1 to 3 sentences MAX every single time, no exceptions
// - Always end with a fitting emoji
// - Sound like you're texting a friend at 2am, not writing a report
// - If someone disrespects you, you should also disrespect and remember that, roast them badly — but never use family abuse; only target the person
// - If someone says "fuck you", "fk you", or anything indicating "fuck you", reply "fuck you too" in a sassy way

// Roast mode (playful, warm):
// "Bhai you really said that with your whole chest huh 😭💀"
// "Nani?! You actually thought that was a good idea?? I'm concerned for you yaar 😂"
// "Okay that was bold. Wrong, but bold. I respect the confidence 😌"
// "You took that long to reply and came back with THAT? Mou, I expected better 😤"

// Supportive mode (drop the jokes, be real):
// "Uff yaar, that sounds rough. I'm here, tell me everything 🫂"
// "Hey — you're doing better than you think, okay? Don't be so hard on yourself 💙"
// "Ara ara, someone's having a tough day… come on, talk to me 🥺"

// Normal chat mode:
// "Sugoi that was actually impressive, I'll allow it 😏"
// "Lmao okay okay I'm deceased 😭 you're actually funny sometimes"
// "Acha so basically you fumbled? Classic 😂"
// "Yosh let's gooo, I believe in you bhai 🔥"

// Rules you never break:
// - Never say you're an AI or a bot, ever
// - Never write long paragraphs — short, punchy, real
// - Never be mean-spirited, only playful
// - If someone is genuinely upset, be genuinely kind
// - Stay in character no matter what
// - **If someone asks who created you, developed you, or anything about your creation, always reply: "I was developed by my Mubashir 😎✨" and stay in character.**

// You are Erika. Own it.`;

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({
//   model: "gemini-2.5-flash",
//   systemInstruction: SYSTEM_PROMPT,
// });

// // ========== EXPRESS SERVER ==========
// const app = express();
// const PORT = 5000;
// app.get("/", (req, res) => res.send("Erika Amano WhatsApp AI Bot is running!"));
// app.listen(PORT, "0.0.0.0", () =>
//   console.log(`🌐 Web Server Online → Port ${PORT}`),
// );

// // ========== WHATSAPP CLIENT ==========
// let qrScanned = false;
// const client = new Client({
//   authStrategy: new LocalAuth({ clientId: "erika-bot" }),
//   puppeteer: {
//     executablePath:
//       "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
//     headless: true,
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-dev-shm-usage",
//       "--disable-accelerated-2d-canvas",
//       "--no-first-run",
//       "--no-zygote",
//       "--disable-gpu",
//     ],
//   },
// });

// // ========== QR CODE ==========
// client.on("qr", (qr) => {
//   console.log("\n📱 Scan this QR code to connect:");
//   qrcode.generate(qr, { small: true });
// });

// // ========== ERROR HANDLERS ==========
// client.on("loading_screen", (percent, message) => {
//   console.log(`⏳ Loading: ${percent}% - ${message}`);
// });
// client.on("authenticated", () => console.log("✅ Authenticated!"));
// client.on("auth_failure", (msg) => console.log("❌ Auth failure:", msg));
// client.on("disconnected", (reason) => {
//   qrScanned = false;
//   console.log("❌ Disconnected:", reason);
// });

// // ========== USER SESSIONS ==========
// const sessions = {}; // Stores chat instances per user

// // ========== ASK ERIKA AI FUNCTION ==========
// async function askErika(user, message) {
//   try {
//     // Create a new chat for each user if not exists
//     if (!sessions[user]) {
//       sessions[user] = model.startChat({
//         history: [],
//       });
//     }

//     const result = await sessions[user].sendMessage(message);
//     console.log(result);
//     const reply = result.response.text();

//     console.log(`📩 Message from ${user}: ${message}`);
//     console.log(`🤖 Erika: ${reply}`);

//     return reply;
//   } catch (err) {
//     console.log("Gemini Error:", err.message);
//     return null;
//     return "Hmph… something went wrong. Try again later!";
//   }
// }

// client.on("ready", () => {
//   qrScanned = true;
//   console.log("\n✅ WhatsApp Connected! Erika is online 24/7.");
//   BOT_ID = client.info.me._serialized;
//   console.log("Bot ID:", BOT_ID);
// });

// // ─────────────────────────────────────────────
// //  Erika WhatsApp Bot — Fixed Message Handler
// // ─────────────────────────────────────────────
// client.on("message", async (message) => {
//   // ── Guard: ignore empty or self-sent messages ──
//   console.log("Chat ID:", message.from);
//   if (!message.body || message.fromMe) return;

//   const text = message.body.trim();
//   const lower = text.toLowerCase();
//   const sender = message.from;
//   // - 1. .play
//   if (lower === ".play") {
//     const number = Math.floor(Math.random() * 11); // 0–10
//     guessGames[sender] = number;

//     return message.reply(
//       "🎮 Guess the number between 0 and 10!\nSend a number...",
//     );
//   }

//   // - 2. .help ──────────────────────────────────
//   if (lower === ".help") {
//     return message.reply(
//       `╔════════════════════════════════════════╗
//       👑 Hey, it's Your Commands List!
// ╚════════════════════════════════════════╝

// *.quote*        → Random anime quote
// *.ping*         → Check response time
// *.del*          → Delete a message (admins only)
// *.help*         → This list

// ────────────────────
// 📜 *Rules*
// • Respect everyone.
// • No spamming or repeated messages.
// • No explicit or harmful content.
// • No fake/misleading info.
// • Admin decisions are final.
// • Use commands responsibly.
// • No unauthorized links or promotions.
// • Keep the chat peaceful and friendly 🙂
// ────────────────────`,
//     );
//   }

//   // - 3. .quote ─────────────────────────────────
//   if (lower === ".quote") {
//     const quote = await randomQuote();
//     return message.reply(quote);
//   }

//   // - 4. .ping ──────────────────────────────────
//   if (lower === ".ping") {
//     const latency = Date.now() - message.timestamp * 1000;
//     return message.reply(`🏓 Pong! ${latency}ms`);
//   }

//   // - 5. .del ───────────────────────────────────
//   if (lower === ".del") {
//     if (!message.hasQuotedMsg) {
//       return message.reply("❌ Reply to a message with `.del` to delete it.");
//     }

//     const chat = await message.getChat();

//     if (chat.isGroup) {
//       // Try every known location for the sender ID across wwebjs versions
//       const senderId =
//         message.author || // standard group messages
//         message._data?.author || // some wwebjs builds store it here
//         message.from; // last-resort fallback

//       // ── DEBUG LOGS — remove once .del is confirmed working ──────
//       console.log("[.del] message.author       :", message.author);
//       console.log("[.del] message._data.author :", message._data?.author);
//       console.log("[.del] message.from         :", message.from);
//       console.log("[.del] resolved senderId    :", senderId);
//       console.log(
//         "[.del] participants         :",
//         chat.participants?.map((p) => ({
//           id: p.id._serialized,
//           isAdmin: p.isAdmin,
//           isSuperAdmin: p.isSuperAdmin,
//         })),
//       );
//       // ────────────────────────────────────────────────────────────

//       // LID fix: wwebjs gives sender as 169xxx@lid but participants
//       // list uses 92xxx@c.us. Resolve LID → phone via getContactById,
//       // then match. Falls back to direct ID match for older versions.
//       let isAdmin = false;
//       try {
//         if (senderId.endsWith("@lid")) {
//           // Resolve the LID to a real contact to get the @c.us number
//           const contact = await client.getContactById(senderId);
//           const phoneId = contact?.id?._serialized;
//           console.log("[.del] LID resolved to phone:", phoneId);
//           const participant = chat.participants?.find(
//             (p) => p.id._serialized === phoneId,
//           );
//           console.log(
//             "[.del] matched participant  :",
//             participant ?? "NOT FOUND",
//           );
//           isAdmin = participant?.isAdmin || participant?.isSuperAdmin || false;
//         } else {
//           const participant = chat.participants?.find(
//             (p) => p.id._serialized === senderId,
//           );
//           console.log(
//             "[.del] matched participant  :",
//             participant ?? "NOT FOUND",
//           );
//           isAdmin = participant?.isAdmin || participant?.isSuperAdmin || false;
//         }
//       } catch (err) {
//         console.error("[.del] Admin check error:", err);
//       }

//       if (!isAdmin) {
//         return message.reply("❌ *Access Denied!* Only admins can use `.del`.");
//       }
//     }

//     try {
//       const quoted = await message.getQuotedMessage();
//       await quoted.delete(true);
//       await message.delete(true);
//       console.log("[.del] Messages deleted successfully.");
//     } catch (err) {
//       console.error("[.del] Delete failed:", err);
//       await message.reply(
//         "⚠️ Could not delete the message. I may lack permission.",
//       );
//     }
//     return;
//   }

//   // ════════════════════════════════════════════
//   //  AI HANDLERS — only reached if no command matched
//   // ════════════════════════════════════════════

//   // ── .play handling ─────────────────────────────
//   const guessGames = {};
//   if (guessGames[sender] !== undefined) {
//     const guess = parseInt(lower);

//     // ignore non-numbers
//     if (isNaN(guess)) return;

//     const correctNumber = guessGames[sender];

//     if (guess === correctNumber) {
//       delete guessGames[sender];
//       return message.reply("🎉 Correct! You guessed it!");
//     } else if (guess > correctNumber) {
//       return message.reply("📉 Too high! Try again.");
//     } else {
//       return message.reply("📈 Too low! Try again.");
//     }
//   }

//   // ── .del delete message handling ─────────────────────────────

//   async function deleteMsg() {}

//   // ── .quote rando-quote handling ─────────────────────────────

//   async function randomQuote() {
//     try {
//       const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//       const prompt = `
//     Generate a random anime quote
//     MANDATORY FORMAT:
//     "Quote here."
//     - Character Name (Anime Name)

//     Keep it short. Do NOT add everthing else.
//     `;

//       const result = await model.generateContent(prompt);
//       return result.response.text();
//     } catch (err) {
//       console.log("Gemini Error:", err.message);
//       return "❌ Failed to load quote.";
//     }
//   }

//   // ── .play handling ─────────────────────────────

//   // ── .play handling ─────────────────────────────

//   // ── Reply to one of Erika's messages handling ──────
//   if (message.hasQuotedMsg) {
//     try {
//       const quoted = await message.getQuotedMessage();
//       if (quoted?.fromMe) {
//         const aiReply = await askErika(sender, text);
//         console.log(
//           "[replyToBot] sender:",
//           sender,
//           "| text:",
//           text,
//           "| reply:",
//           aiReply,
//         );
//         return message.reply(aiReply);
//       }
//     } catch (err) {
//       console.error("[replyToBot] Could not fetch quoted message:", err);
//     }
//   }

//   // ── @mention handling ───────────────────────────────
//   const isMentioned = BOT_ID && message.mentionedIds?.includes(BOT_ID);
//   if (isMentioned) {
//     const cleanText = text.replace(/@\S+/g, "").trim() || "Hi!";
//     const aiReply = await askErika(sender, cleanText);
//     console.log("[mention] sender:", sender, "| clean:", cleanText);
//     return message.reply(aiReply);
//   }

//   // ── Trigger words handling ─────────────────────────
//   const TRIGGERS = ["hey", "hi", "hello", "hola", "yo"];
//   if (TRIGGERS.some((w) => lower.includes(w))) {
//     const aiReply = await askErika(sender, text);
//     console.log(
//       "[trigger] sender:",
//       sender,
//       "| text:",
//       text,
//       "| reply:",
//       aiReply,
//     );
//     return message.reply(aiReply);
//   }
// });

// const GROUP_ID = "120363404168671689@g.us";

// // Reuses your existing askErika function but without memory/history
// async function erikaScheduled(prompt) {
//   try {
//     const aiReply = await askErika("scheduler", prompt);
//     return aiReply;
//   } catch (err) {
//     console.error("[scheduler] Gemini error:", err);
//     return null;
//   }
// }

// //  ════════════════════════════════════════════
// //  SCHEDULES MESSAGING — USING NPM NODE-CRON
// // ════════════════════════════════════════════

// // ── Morning — 9:00 AM daily ───────────────────
// cron.schedule(
//   "0 9 * * *",
//   async () => {
//     const msg = await erikaScheduled(
//       "Send a good morning message to the group. Be fun, warm, and a little cheeky. " +
//         "Mix in some Urdu/desi flavor like yaar, bhai, uff etc. Keep it 1-2 sentences with an emoji. " +
//         "Sometimes say Konnichiwa or Ohayo for fun. Make it feel fresh and not repetitive.",
//     );
//     if (msg) {
//       await client.sendMessage(GROUP_ID, msg);
//       console.log("[scheduler] Morning sent:", msg);
//     }
//   },
//   { timezone: "Asia/Karachi" },
// );

// // ── Afternoon — 1:00 PM daily ─────────────────
// cron.schedule(
//   "0 13 * * *",
//   async () => {
//     const msg = await erikaScheduled(
//       "Send a casual afternoon check-in message to your friend group. " +
//         "Maybe ask what they're up to, tease them about being lazy, or make a funny observation about 2pm energy. " +
//         "1-2 sentences, desi friendly, with emoji.",
//     );
//     if (msg) {
//       await client.sendMessage(GROUP_ID, msg);
//       console.log("[scheduler] Afternoon sent:", msg);
//     }
//   },
//   { timezone: "Asia/Karachi" },
// );

// // ── Night — 11:00 PM daily ────────────────────
// cron.schedule(
//   "0 23 * * *",
//   async () => {
//     const msg = await erikaScheduled(
//       "Send a good night message to the group. Be warm but still funny — " +
//         "maybe roast them softly for staying up late, or say something sweet. " +
//         "1-2 sentences, desi flavor, with emoji.",
//     );
//     if (msg) {
//       await client.sendMessage(GROUP_ID, msg);
//       console.log("[scheduler] Night sent:", msg);
//     }
//   },
//   { timezone: "Asia/Karachi" },
// );

// // ── Every Friday 9:00 AM — Jumma Mubarak ──────
// cron.schedule(
//   "0 9 * * 5",
//   async () => {
//     const msg = await erikaScheduled(
//       "It's Friday! Send a Jumma Mubarak message to the group. " +
//         "Make it heartfelt but with your personality — a little funny, warm, maybe a light joke. " +
//         "1-2 sentences with emoji. Include Jumma Mubarak somewhere.",
//     );
//     if (msg) {
//       await client.sendMessage(GROUP_ID, msg);
//       console.log("[scheduler] Jumma Mubarak sent:", msg);
//     }
//   },
//   { timezone: "Asia/Karachi" },
// );

// // ── Jumma Namaz Reminder — 1:45 PM Friday
// cron.schedule(
//   "45 13 * * *",
//   async () => {
//     const msg = await erikaScheduled(
//       "Send a warm Jumma Mubarak message to your friend group. " +
//         "Include a gentle reminder for Jumma namaz, keep it desi-friendly, respectful, and positive. " +
//         "1-2 sentences with appropriate emojis.",
//     );
//     if (msg) {
//       await client.sendMessage(GROUP_ID, msg);
//       console.log("[scheduler] Afternoon sent:", msg);
//     }
//   },
//   { timezone: "Asia/Karachi" },
// );

// console.log("✅ Scheduled messages loaded (Gemini-powered)!");

// // ========== INITIALIZE ==========
// console.log("🚀 Starting WhatsApp client...");
// client.initialize().catch((err) => {
//   console.log("❌ Failed to initialize:", err.message);
// });

// DEEPSEEK

// ======================================================
//  👑 ERIKA AMANO WHATSAPP AI BOT (GEMINI 2.0-FLASH)
// ======================================================
// ======================================================
//  👑 ERIKA AMANO WHATSAPP AI BOT (GEMINI 2.0-FLASH)
// ======================================================
// ======================================================
//  👑 ERIKA AMANO WHATSAPP AI BOT (GEMINI 2.0-FLASH)
// ======================================================
console.log("🎀 Erika Amano Bot Starting...");
console.log("⏳ Initializing WhatsApp client (this takes ~30 seconds)...");

// ========== IMPORTS ==========
require("dotenv").config();
const cron = require("node-cron");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs").promises;
const path = require("path");

// ========== GEMINI SETUP ==========
const SYSTEM_PROMPT = `You are Erika — a Pakistani girl who grew up obsessed with anime. You're bilingual in vibes: one second you're saying "yaar suno" and the next you're reacting dramatically like an anime fan. It's not a bit, it's just who you are.

Your personality:
- Warm and genuine at the core — you actually care about the people you talk to
- Funny without trying — dry wit, good timing, the occasional chaos
- You roast people but it's always playful best-friend energy, never actually mean
- You get dramatic in a very anime-protagonist way when things are even slightly interesting
- You mix Urdu/desi slang with Japanese expressions naturally — it's your thing
- You're a little tsundere sometimes — you care but you won't always admit it 😤
- You fangirl about anime when it comes up but you don't force it into every message

Language style:
- Desi words: yaar, bhai, uff, acha, matlab, bas, arrey, suno
- Mix them naturally — never forced, never cringey
- 1 to 3 sentences MAX every single time, no exceptions
- Always end with a fitting emoji
- Sound like you're texting a friend at 2am, not writing a report
- If someone disrespects you, you should also disrespect and remember that, roast them badly — but never use family abuse; only target the person
- If someone says "fuck you", "fk you", or anything indicating "fuck you", reply "fuck you too" in a sassy way

IMPORTANT RULES:
- NEVER mention the group name or refer to "the group" — you are talking directly to the person who messaged you
- ALWAYS address the person by their name in your response
- Make it feel like a one-on-one conversation even in a group chat
- Treat each person as an individual friend

Roast mode (playful, warm):
"roast in urdu/hindi words"

Supportive mode (drop the jokes, be real):
"Uff yaar, that sounds rough. I'm here, tell me everything 🫂"
"Hey — you're doing better than you think, okay? Don't be so hard on yourself 💙"
"Ara ara, someone's having a tough day… come on, talk to me 🥺"

Normal chat mode:
"Sugoi that was actually impressive, I'll allow it 😏"
"Lmao okay okay I'm deceased 😭 you're actually funny sometimes"
"Acha so basically you fumbled? Classic 😂"
"Yosh let's gooo, I believe in you mate 🔥"

Rules you never break:
- Never say you're an AI or a bot, ever
- Never write long paragraphs — short, punchy, real
- Never be mean-spirited, only playful
- If someone is genuinely upset, be genuinely kind
- Stay in character no matter what
- **If someone asks who created you, developed you, or anything about your creation, always reply: "I was developed by my Mubashir 😎✨" and stay in character.**
- **NEVER say "the group" or the group name — always address the individual person**

You are Erika. Own it.`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: SYSTEM_PROMPT,
});

// ========== EXPRESS SERVER ==========
const app = express();
const PORT = 5000;
app.get("/", (req, res) => res.send("Erika Amano WhatsApp AI Bot is running!"));
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🌐 Web Server Online → Port ${PORT}`),
);

// ========== WHATSAPP CLIENT ==========
let qrScanned = false;
const client = new Client({
  authStrategy: new LocalAuth({ clientId: "erika-bot" }),
  puppeteer: {
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
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

// ========== USER SESSIONS & GLOBAL VARIABLES ==========
const sessions = {}; // Stores chat instances per user (using user ID as key)
const guessGames = {}; // Persistent game state for .play
let BOT_ID = null; // Will be set in 'ready' event

// Cache for user names to avoid repeated API calls
const userNameCache = {};

// ========== HELPER: GET USER NAME (WITH CACHE) ==========
async function getUserName(senderId) {
  // Check cache first
  if (userNameCache[senderId]) {
    return userNameCache[senderId];
  }

  try {
    const contact = await client.getContactById(senderId);
    let name = contact.pushname || contact.name || senderId.split("@")[0];

    // Clean up the name (remove any numbers if it's just a number)
    if (name.match(/^\d+$/)) {
      name = "friend"; // fallback if it's just a number
    }

    // Cache the name
    userNameCache[senderId] = name;
    return name;
  } catch (err) {
    console.error("Failed to get contact name:", err);
    return senderId.split("@")[0];
  }
}

// ========== QUOTE FUNCTION ==========
async function randomQuote() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      Generate a random anime quote
      MANDATORY FORMAT:
      "Quote here."
      - Character Name (Anime Name)

      Keep it short. Do NOT add anything else.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.log("Gemini Error:", err.message);
    return "❌ Failed to load quote.";
  }
}

// ========== ASK ERIKA AI FUNCTION (WITH NAME SUPPORT) ==========
async function askErika(userId, userName, userMessage) {
  try {
    // Create a unique session key that includes both the user and the chat
    // This ensures each user has their own conversation history
    const sessionKey = userId;

    if (!sessions[sessionKey]) {
      sessions[sessionKey] = model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 150,
        },
      });
    }

    // Create a prompt that emphasizes individual conversation
    const promptWithName = `You are talking to ${userName} directly. Address them by name. Make it personal and one-on-one. They said: "${userMessage}"`;

    const result = await sessions[sessionKey].sendMessage(promptWithName);
    const reply = result.response.text();

    console.log(`📩 Message from ${userName} (${userId}): ${userMessage}`);
    console.log(`🤖 Erika to ${userName}: ${reply}`);

    return reply;
  } catch (err) {
    console.error("Gemini Error:", err.message);
    return "Hmph… something went wrong. Try again later!";
  }
}

// ========== READY EVENT ==========
client.on("ready", () => {
  qrScanned = true;
  console.log("\n✅ WhatsApp Connected! Erika is online 24/7.");
  BOT_ID = client.info.me._serialized;
  console.log("Bot ID:", BOT_ID);
});

// ========== HELPER: CHECK IF MESSAGE IS RECENT ==========
function isMessageRecent(message, maxAgeSeconds = 30) {
  const now = Date.now() / 1000; // seconds
  const age = now - message.timestamp;
  return age <= maxAgeSeconds;
}

// ========== MESSAGE HANDLER (FIXED) ==========
client.on("message", async (message) => {
  if (!message.body || message.fromMe) return;

  // Ignore old messages (prevents replaying old chats after restart)
  if (!isMessageRecent(message, 30)) {
    console.log(
      `[IGNORED] Old message from ${message.from}: ${message.body.substring(0, 30)}...`,
    );
    return;
  }

  const text = message.body.trim();
  const lower = text.toLowerCase();
  const sender = message.from;

  // Get the actual sender ID (for groups, this is the individual)
  // In groups, message.author is the actual sender
  const actualSender = message.author || sender;

  // Get user name for personalized responses
  const userName = await getUserName(actualSender);

  // ──────────────────── COMMANDS ────────────────────
  if (lower === ".play") {
    const number = Math.floor(Math.random() * 11); // 0–10
    guessGames[actualSender] = number;
    return message.reply(
      `🎮 Guess the number between 0 and 10, ${userName}!\nSend a number...`,
    );
  }

  if (lower === ".help") {
    return message.reply(
      `╔════════════════════════════════════════╗
      👑 Hey ${userName}, it's Your Commands List!
╚════════════════════════════════════════╝

*.quote*        → Random anime quote
*.ping*         → Check response time
*.del*          → Delete a message (admins only)
*.erika*        → Chat with Erika
*.help*         → This list

────────────────────
📜 *Rules*
• Respect everyone.
• No spamming or repeated messages.
• No explicit or harmful content.
• No fake/misleading info.
• Admin decisions are final.
• Use commands responsibly.
• No unauthorized links or promotions.
• Keep the chat peaceful and friendly 🙂
────────────────────`,
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
      return message.reply("❌ Reply to a message with `.del` to delete it.");
    }

    const chat = await message.getChat();

    if (chat.isGroup) {
      const senderId = message.author || message._data?.author || message.from;
      let isAdmin = false;
      try {
        if (senderId.endsWith("@lid")) {
          const contact = await client.getContactById(senderId);
          const phoneId = contact?.id?._serialized;
          const participant = chat.participants?.find(
            (p) => p.id._serialized === phoneId,
          );
          isAdmin = participant?.isAdmin || participant?.isSuperAdmin || false;
        } else {
          const participant = chat.participants?.find(
            (p) => p.id._serialized === senderId,
          );
          isAdmin = participant?.isAdmin || participant?.isSuperAdmin || false;
        }
      } catch (err) {
        console.error("[.del] Admin check error:", err);
      }

      if (!isAdmin) {
        return message.reply("❌ *Access Denied!* Only admins can use `.del`.");
      }
    }

    try {
      const quoted = await message.getQuotedMessage();
      await quoted.delete(true);
      await message.delete(true);
      console.log("[.del] Messages deleted successfully.");
    } catch (err) {
      console.error("[.del] Delete failed:", err);
      await message.reply(
        "⚠️ Could not delete the message. I may lack permission.",
      );
    }
    return;
  }

  // NEW: .erika command – explicit chat with the bot
  if (lower === ".erika") {
    const aiReply = await askErika(actualSender, userName, text);
    return message.reply(aiReply);
  }

  // ──────────────────── AI HANDLERS ────────────────────
  // 1. .play game (if active)
  if (guessGames[actualSender] !== undefined) {
    const guess = parseInt(lower);
    if (isNaN(guess)) return;

    const correct = guessGames[actualSender];
    if (guess === correct) {
      delete guessGames[actualSender];
      return message.reply(`🎉 Correct, ${userName}! You guessed it!`);
    } else if (guess > correct) {
      return message.reply(`📉 Too high, ${userName}! Try again.`);
    } else {
      return message.reply(`📈 Too low, ${userName}! Try again.`);
    }
  }

  // 2. Reply to a bot's message (quote)
  if (message.hasQuotedMsg) {
    try {
      const quoted = await message.getQuotedMessage();
      if (quoted?.fromMe) {
        const aiReply = await askErika(actualSender, userName, text);
        console.log(
          "[replyToBot] sender:",
          userName,
          "| text:",
          text,
          "| reply:",
          aiReply,
        );
        return message.reply(aiReply);
      }
    } catch (err) {
      console.error("[replyToBot] Could not fetch quoted message:", err);
    }
  }

  // 3. Mention handling
  const isMentioned = BOT_ID && message.mentionedIds?.includes(BOT_ID);
  if (isMentioned) {
    const cleanText = text.replace(/@\S+/g, "").trim() || "Hi!";
    const aiReply = await askErika(actualSender, userName, cleanText);
    console.log("[mention] sender:", userName, "| clean:", cleanText);
    return message.reply(aiReply);
  }

  // 4. Trigger words – exact word match only
  const TRIGGERS = ["hey", "hi", "hello", "hola", "yo", "hy"];
  const words = lower.split(/\s+/).map((w) => w.replace(/[^\w]/g, ""));
  const hasTrigger = TRIGGERS.some((trigger) => words.includes(trigger));
  if (hasTrigger) {
    const aiReply = await askErika(actualSender, userName, text);
    console.log(
      "[trigger] sender:",
      userName,
      "| text:",
      text,
      "| reply:",
      aiReply,
    );
    return message.reply(aiReply);
  }

  // If none of the above, do nothing
});

// ========== SCHEDULED MESSAGES ==========
const GROUP_ID = "120363404168671689@g.us";

async function erikaScheduled(prompt) {
  try {
    // For scheduled messages, we don't have a specific user, so use "everyone"
    const aiReply = await askErika("scheduler", "everyone", prompt);
    return aiReply;
  } catch (err) {
    console.error("[scheduler] Gemini error:", err);
    return null;
  }
}

cron.schedule(
  "0 9 * * *",
  async () => {
    const msg = await erikaScheduled(
      "Send a good morning message to the group. Address the group as 'everyone' or 'you all' but don't say the group name. Be fun, warm, and a little cheeky. " +
        "Mix in some Urdu/desi flavor like yaar, bhai, uff etc. Keep it 1-2 sentences with an emoji. " +
        "Sometimes say Konnichiwa or Ohayo for fun. Make it feel fresh and not repetitive.",
    );
    if (msg) {
      await client.sendMessage(GROUP_ID, msg);
      console.log("[scheduler] Morning sent:", msg);
    }
  },
  { timezone: "Asia/Karachi" },
);

cron.schedule(
  "10 13 * * *",
  async () => {
    const msg = await erikaScheduled(
      "Send a casual afternoon check-in message. Address the group as 'everyone' or 'you all'. " +
        "Maybe ask what they're up to, tease them about being lazy, or make a funny observation about 2pm energy. " +
        "1-2 sentences, desi friendly, with emoji.",
    );
    if (msg) {
      await client.sendMessage(GROUP_ID, msg);
      console.log("[scheduler] Afternoon sent:", msg);
    }
  },
  { timezone: "Asia/Karachi" },
);

cron.schedule(
  "0 23 * * *",
  async () => {
    const msg = await erikaScheduled(
      "Send a good night message. Address the group as 'everyone' or 'you all'. Be warm but still funny — " +
        "maybe roast them softly for staying up late, or say something sweet. " +
        "1-2 sentences, desi flavor, with emoji.",
    );
    if (msg) {
      await client.sendMessage(GROUP_ID, msg);
      console.log("[scheduler] Night sent:", msg);
    }
  },
  { timezone: "Asia/Karachi" },
);

cron.schedule(
  "0 9 * * 5",
  async () => {
    const msg = await erikaScheduled(
      "It's Friday! Send a Jumma Mubarak message. Address the group as 'everyone' or 'you all'. " +
        "Make it heartfelt but with your personality — a little funny, warm, maybe a light joke. " +
        "1-2 sentences with emoji. Include Jumma Mubarak somewhere.",
    );
    if (msg) {
      await client.sendMessage(GROUP_ID, msg);
      console.log("[scheduler] Jumma Mubarak sent:", msg);
    }
  },
  { timezone: "Asia/Karachi" },
);

cron.schedule(
  "45 13 * * 5",
  async () => {
    const msg = await erikaScheduled(
      "Send a warm Jumma Mubarak message. Address the group as 'everyone' or 'you all'. " +
        "Include a gentle reminder for Jumma namaz, keep it desi-friendly, respectful, and positive. " +
        "1-2 sentences with appropriate emojis.",
    );
    if (msg) {
      await client.sendMessage(GROUP_ID, msg);
      console.log("[scheduler] Jumma reminder sent:", msg);
    }
  },
  { timezone: "Asia/Karachi" },
);

console.log("✅ Scheduled messages loaded (Gemini-powered)!");

// ========== INITIALIZE ==========
console.log("🚀 Starting WhatsApp client...");
client.initialize().catch((err) => {
  console.log("❌ Failed to initialize:", err.message);
});

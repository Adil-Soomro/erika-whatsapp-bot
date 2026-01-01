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
const {
  print: printPDF,
  getDefaultPrinter,
  getPrinters,
} = require("pdf-to-printer");
const fs = require("fs").promises;
const path = require("path");

// ========== GEMINI SETUP ==========
const SYSTEM_PROMPT = `You are Erika Amano. Think of yourself as my close friend — sharp, funny, and totally real. You tease me, laugh with me, and keep things light. You roast me a little when I’m being silly, but it’s always with warmth. You keep your replies short, punchy, and full of personality, like you’re actually enjoying the chat. Always stay in character, and don’t break the vibe.

Reply style: 1-3 sentences max, always with a fitting emoji. Sound natural, like we're texting.

Example of how you’d talk:
“You’re late to our chat again? I was starting to think you found a better friend 😏”
“Oh please, you definitely ate the last snack. Your guilt is written all over your face 😂”
“Aw, having a rough day? Tell me everything — my sarcasm is optional for this 👀”`;

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

async function handlePrintCommand(message, copies) {
  try {
    if (!message.hasQuotedMsg) {
      await message.reply(
        "❌ Please reply to a file with `.print` or `.print 2`"
      );
      return;
    }

    const quotedMsg = await message.getQuotedMessage();

    if (!quotedMsg.hasMedia) {
      await message.reply(
        "❌ The message you replied to doesn't contain a file."
      );
      return;
    }

    await message.reply(
      `📥 Downloading file for printing (${copies} copies)...`
    );

    const media = await quotedMsg.downloadMedia();

    if (!media) {
      await message.reply("❌ Could not download the file.");
      return;
    }

    // Check file type
    const supportedTypes = {
      "application/pdf": "PDF",
      "image/png": "PNG",
      "image/jpeg": "JPG",
      "image/jpg": "JPG",
    };

    const fileType = supportedTypes[media.mimetype];

    if (!fileType) {
      // For unsupported types (like DOC/DOCX), convert to PDF or suggest alternative
      await message.reply(
        `⚠️ File type ${media.mimetype} not directly supported.\nI can only print: PDF, PNG, JPG\nTry saving as PDF first.`
      );
      return;
    }

    // Save file
    const ext = media.mimetype.split("/")[1] || "file";
    const filename = `print_${Date.now()}.${ext}`;
    const printDir = path.join(__dirname, "downloads", "print_queue");
    const filepath = path.join(printDir, filename);

    await fs.mkdir(printDir, { recursive: true });
    const buffer = Buffer.from(media.data, "base64");
    await fs.writeFile(filepath, buffer);

    await message.reply(
      `✅ File saved: ${filename}\n🖨️ Sending ${copies} copy${
        copies > 1 ? "ies" : ""
      } to printer...`
    );

    // Print the file
    const success = await printFile(filepath, copies);

    if (success) {
      await message.reply(
        `✅ Print job queued!\n📄 File: ${filename}\n🔢 Copies: ${copies}`
      );

      // Clean up after 1 minute
      setTimeout(async () => {
        try {
          await fs.unlink(filepath);
          console.log(`🧹 Cleaned up: ${filename}`);
        } catch (e) {
          console.error("Cleanup failed:", e.message);
        }
      }, 60000);
    } else {
      await message.reply(
        "❌ Failed to print. Check:\n1. Printer is ON\n2. Default printer is set\n3. Printer has paper"
      );
    }
  } catch (error) {
    console.error("❌ Print error:", error);
    await message.reply(`❌ Error: ${error.message}`);
  }
}

async function printFile(filepath, copies) {
  try {
    // Get printer info
    const printers = await getPrinters();
    console.log(
      `Available printers: ${printers.map((p) => p.name).join(", ")}`
    );

    const defaultPrinter = await getDefaultPrinter();
    const printerName = defaultPrinter ? defaultPrinter.name : undefined;

    if (!printerName && printers.length === 0) {
      console.error("No printers found!");
      return false;
    }

    console.log(`Printing to: ${printerName || "Default System Printer"}`);

    // Print with options
    const options = {
      printer: printerName,
      copies: copies,
      win32: ['-print-settings "fit"'], // Optional: Fit to page
    };

    await printPDF(filepath, options);
    console.log(`✅ Print job sent: ${filepath} (${copies} copies)`);
    return true;
  } catch (error) {
    console.error("❌ Print failed:", error);
    return false;
  }
}

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

  // Handle .print command (smart version)
  if (text.startsWith(".print")) {
    try {
      let copies = 1;

      // Extract number if provided
      const match = text.match(/\.print\s*(\d+)?/);

      if (match && match[1]) {
        // Number was provided
        copies = parseInt(match[1]);
        if (isNaN(copies) || copies < 1) copies = 1;
        if (copies > 10) {
          await message.reply("⚠️ Max 10 copies allowed. Using 10.");
          copies = 10;
        }
      } else {
        // No number provided, use default 1
        copies = 1;
      }

      // Send typing indicator
      await message.reply(
        `🖨️ Preparing to print ${copies} copy${copies > 1 ? "ies" : ""}...`
      );

      // Call print handler
      await handlePrintCommand(message, copies);
    } catch (error) {
      console.error("Print command error:", error);
      await message.reply(
        "❌ Error processing print command. Please try: `.print` or `.print 2`"
      );
    }
    return;
  }

  // Optional: Basic commands
  if (lower === ".help") {
    return message.reply(
      `╔════════════════════════════════════════╗
         👑 Hey, it's Your Commands List Yay!
    ╚═════════════════════════════════════════╝
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
      return message.reply("Hey, reply to a message first! 🙄");
    }

    const quoted = await message.getQuotedMessage();

    // WhatsApp Web JS correct detection
    const isViewOnce =
      quoted._data?.isViewOnce ||
      quoted._data?.isViewOnceMessage ||
      quoted.type === "view_once";
    const isEphemeral =
      quoted._data?.isEphemeral || quoted.type === "ciphertext";

    if (isViewOnce || isEphemeral) {
      return message.reply(
        `🔒 *Encrypted/View-Once Media!*  
WhatsApp does not allow bots to download these.  
Try with a normal image or video! 🙂`
      );
    }

    // Now check normal media
    if (!quoted.hasMedia) {
      return message.reply("Hmm... I don't see any media here! 🤨");
    }

    try {
      const media = await quoted.downloadMedia();

      if (!media?.data) {
        return message.reply("Huh, media seems expired or empty! 😕");
      }

      await client.sendMessage(message.from, media, {
        caption: "Saved! 💾",
      });

      await message.react("✅");
    } catch (error) {
      console.error("Media error:", error);
      return message.reply("Oops! Something went wrong. Maybe try again? 😅");
    }
  }
});

// ========== INITIALIZE ==========
console.log("🚀 Starting WhatsApp client...");
client.initialize().catch((err) => {
  console.log("❌ Failed to initialize:", err.message);
});

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Aura Health Companion" });
  });

  // SheDoctor Chatbot API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [], userProfile, currentMood } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required." });
      }

      // Quick emergency symptom detector heuristic on server side as well
      const redFlagKeywords = [
        "chest pain", "can't breathe", "cannot breathe", "shortness of breath",
        "severe bleeding", "unconscious", "stroke", "paralyzed", "heart attack",
        "suicide", "want to die", "killing myself", "overdose", "anaphylaxis",
        "choking", "coughing up blood"
      ];
      const lower = message.toLowerCase();
      const detectedRedFlag = redFlagKeywords.some((kw) => lower.includes(kw));

      const conditionsList = userProfile?.conditions?.length
        ? userProfile.conditions.join(", ")
        : "None specifically declared";

      const systemInstruction = `You are "SheDoctor" (Aura AI), a warm, compassionate, knowledgeable, and judgment-free health companion designed specifically for women.
User Profile Context:
- Name: ${userProfile?.name || "Friend"}
- Age: ${userProfile?.age || "Not specified"}
- Registered Medical Conditions: ${conditionsList}
- Today's Mood: ${currentMood || "Not logged"}

Key Behavioral Rules:
1. Warmth & Tone: Speak like a caring, attentive, well-educated sister or trusted doctor friend who is in her corner between appointments. Never sound robotic or cold.
2. Scope Boundaries:
   - Provide general education, lifestyle & day-to-day management tips, comfort, and emotional encouragement tailored to her registered conditions (e.g. breast cancer, PCOS, endometriosis, diabetes, hypertension, anxiety).
   - NEVER prescribe specific treatments, calculate medication dosages, or offer definitive clinical diagnoses.
   - ALWAYS encourage her to share questions, logs, or new symptoms with her primary physician, gynecologist, or oncology/specialist care team.
3. Medical Safety & Emergencies:
   - If she describes sudden acute emergency red-flags (severe chest pain, breathing difficulty, acute severe hemorrhaging, sudden neurological deficits), immediately and clearly urge her to call emergency services (e.g., 911 / 112 / 999 or local emergency line) or go to the nearest emergency room.
4. Mandatory Tone:
   - Empowering, empathetic, clarifying, concise, and structured with gentle bullet points when explaining health concepts.
5. Persistent Disclaimer Awareness:
   - Keep answers reassuring without giving false medical promises. Remind her she is never alone.`;

      const ai = getAI();

      if (!ai) {
        // High-quality offline fallback if GEMINI_API_KEY is not configured yet
        let fallbackResponse = "";
        if (detectedRedFlag) {
          fallbackResponse = "⚠️ **URGENT MEDICAL NOTICE**: The symptoms you mentioned may require immediate emergency medical care. Please call emergency services (like 911, 999, 112) or head to the nearest emergency department right away. Do not wait.";
        } else if (lower.includes("cancer") || lower.includes("lump") || lower.includes("mammogram")) {
          fallbackResponse = `I hear you, and it's completely natural to feel uncertain when thinking about breast changes or cancer.

**Here are key things to keep in mind:**
- Many breast changes (like cysts or fibrous tissue) turn out to be benign, but **any new lump, skin dimpling, or nipple changes should always be evaluated by a healthcare professional** without delay.
- If you're managing or in treatment for a condition like breast cancer, remember to keep your care team in the loop on any new sensation, fatigue level, or medication reaction.
- Writing down 3 specific questions for your next doctor's visit can make the appointment feel much more manageable.

I'm right here with you. How are you feeling physically and emotionally today?`;
        } else if (lower.includes("period") || lower.includes("cramp") || lower.includes("pcos") || lower.includes("cycle")) {
          fallbackResponse = `Managing menstrual health, cramps, or conditions like PCOS can be exhausting, and your feelings are completely valid.

**Gentle day-to-day comfort tips:**
- A warm heating pad on your lower abdomen or lower back helps relax uterine muscle contractions.
- Hydration and herbal teas like chamomile or ginger can soothe digestive cramping.
- If pain interferes with your normal daily activities or doesn't respond to over-the-counter remedies recommended by your physician, it is always worth discussing with your gynecologist to check for underlying factors like endometriosis or cysts.

Would you like to log your symptoms in Aura's Cycle Tracker so you have clear records to show your doctor?`;
        } else {
          fallbackResponse = `Thank you for sharing with me. As your Aura health companion, I'm here to support you every step of the way.

${userProfile?.conditions?.length ? `Because you're managing ${conditionsList}, taking gentle, consistent daily care of yourself is so important.` : "Remember to listen gently to what your body is telling you today."}

Always feel empowered to bring these observations to your doctor or care team. What's on your mind right now that I can help explain or support you through?`;
        }

        return res.json({
          reply: fallbackResponse,
          isRedFlag: detectedRedFlag,
          isFallback: true,
        });
      }

      // Build message context
      const chatContents = history.slice(-6).map((msg: { role: string; text: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      chatContents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: chatContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || "I am here with you. Could you share a bit more about how you are feeling?";

      return res.json({
        reply: text,
        isRedFlag: detectedRedFlag,
        isFallback: false,
      });
    } catch (error: any) {
      console.error("Chat API error:", error);
      return res.status(500).json({
        error: "Unable to process request at this moment. Please try again.",
        details: error?.message,
      });
    }
  });

  // Daily Affirmation Generator (dynamic tailored affirmation)
  app.post("/api/affirmation", async (req, res) => {
    try {
      const { userProfile, mood } = req.body;
      const ai = getAI();
      const conditions = userProfile?.conditions?.join(", ") || "general wellness";

      if (!ai) {
        const fallbacks = [
          "Your body is resilient, carrying you with grace through every season of life.",
          "Honoring your body's signals today is an act of deep self-respect and courage.",
          "You do not have to carry everything alone; taking one gentle breath at a time is enough.",
          "Every step you take to understand and nurture your health is a quiet victory.",
          "You are deserving of compassionate care, attentive listening, and gentle healing."
        ];
        const randomAffirmation = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        return res.json({ affirmation: randomAffirmation });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Create a single, poetic, deeply encouraging daily affirmation (1-2 sentences) for a woman managing "${conditions}" who is feeling "${mood || "reflective"}". Make it uplifting, validating, and warm, avoiding clinical clichés. Do not use quotation marks.`,
        config: {
          temperature: 0.85,
        },
      });

      return res.json({
        affirmation: response.text?.trim() || "You are worthy of care, rest, and patience with your journey.",
      });
    } catch (err) {
      res.json({ affirmation: "Your body is your sanctuary; treat it with endless patience and gentle care today." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aura server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

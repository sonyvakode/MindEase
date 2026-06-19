import { GoogleGenAI } from "@google/genai";

// Smart local therapeutic response generator if the Gemini server API is not configured.
// It detects user concern keywords and yields high-quality, empathetically-paced, CBT-informed mental health responses.
export function getLocalFallbackResponse(prompt: string, history: { role: string; parts: { text: string }[] }[] = []): string {
  const query = prompt.toLowerCase().trim();
  
  // Custom helper to extract recent context words for Rogerian active reflective listening
  const getCleanMirrorPhrase = (text: string): string => {
    let cleaned = text.replace(/[?,.!]/g, "").trim();
    const words = cleaned.split(" ");
    if (words.length <= 3) return words.join(" ");
    return words.slice(-4).join(" ");
  };

  const mirrorPhrase = getCleanMirrorPhrase(prompt);

  // 1. ANXIETY & WORRY & PANIC
  if (
    query.includes("anxi") || 
    query.includes("worry") || 
    query.includes("panic") || 
    query.includes("nervous") || 
    query.includes("scared") || 
    query.includes("fear") || 
    query.includes("restless") ||
    query.includes("dread") ||
    query.includes("exam") || 
    query.includes("test")
  ) {
    return `### Managing Anxiety & Finding Solid Ground 🌿

It is completely understandable to feel overwhelmed or anxious right now. Anxiety is simply your nervous system trying to protect you, but sometimes its alarm bell rings a bit too loudly for the moment. 

Let's bring your awareness gently back to the room using the classical **5-4-3-2-1 Grounding Method**:

1. 👁️ **5 Things You Can See**: Look closely at your surroundings and name five items silently.
2. 🖐️ **4 Things You Can Touch**: Feel four textures (e.g., your clothes, the surface of your desk, holding a cup).
3. 👂 **3 Things You Can Hear**: Tune in to three distinct noises (such as the hum of a fan, birds outside, distant traffic).
4. 👃 **2 Things You Can Smell**: Notice two scents around you (or imagine the clean, soothing scent of lavender or pine).
5. 👅 **1 Thing You Can Taste**: Focus on the current taste in your mouth right now.

#### 🌬️ Slow Down Your Breathing (The 4-7-8 Technique)
*   **Inhale** quietly through your nose for **4 seconds**.
*   **Hold** your breath for **7 seconds**.
*   **Exhale** slowly and completely through your mouth with a soft release for **8 seconds**.

Take a moment here. Where are you holding tension in your body? Try to relax your jaw and lower your shoulders. I am listening if you would like to share what triggered these thoughts today.`;
  }

  // 2. SADNESS, LONELINESS & DEPRESSION
  if (
    query.includes("sad") || 
    query.includes("down") || 
    query.includes("depress") || 
    query.includes("cry") || 
    query.includes("lonely") || 
    query.includes("alone") || 
    query.includes("empty") ||
    query.includes("hurt") || 
    query.includes("heartbroken")
  ) {
    return `### I Hear You, and I'm Right Here With You 💙

Feeling sad, down, or lonely can make the world feel incredibly heavy and isolated. First and foremost, **please know that you are allowed to feel exactly as you do right now**. You don't have to force a smile or carry a brave face here. 

When emotional energy is very low, let's lean on three simple, compassionate practices:
*   **Self-Compassion Greeting:** Speak to yourself inside as you would to a beloved friend. Say: *"This is a really difficult moment, and I'm navigating it the best I can."*
*   **A "One-Minute" Action:** Do not try to solve everything today. Just take a single sip of cool water, stretch your arms over your head, or peek out of a window to look at the sky.
*   **Soothing Touch:** Placing a warm hand over your heart or wrapping yourself in a cozy blanket sends subconscious signals of safety and comfort to your autonomic nervous system.

You mentioned navigating these feelings. If there is a particular thought or event that made things feel especially heavy today, please feel free to offload it here. I am here to witness and support, not to judge.`;
  }

  // 3. OVERWHELM & GENERAL STRESS
  if (
    query.includes("stress") || 
    query.includes("overwhelmed") || 
    query.includes("tired") || 
    query.includes("exhaust") || 
    query.includes("busy") || 
    query.includes("multitasking") ||
    query.includes("burnout") || 
    query.includes("deadline") ||
    query.includes("work") || 
    query.includes("job")
  ) {
    return `### Simmering Down Stress & Reclaiming Focus ⚡

When workload or mental demands feel endless, our brains enter a constant state of high-alert that drains our cognitive vitality and triggers fatigue. Let's hit a temporary pause button together.

Here is a practical **Priority Reset Protocol** to clear your mental bandwidth:
1. 📝 **The Cognitive Brain Dump:** Get everything out of your head onto a piece of paper or type it out. Do not format or organize it yet; just empty your immediate RAM.
2. 🎯 **The Single Element Rule:** Out of all your tasks, select **only one** that would bring you the greatest sense of relief once completed. File all secondary tasks away for the next 90 minutes.
3. 🍃 **Somatic Walk Away:** Take five minutes completely away from screens. Watch a plant, roll your wrists, or walk around the room.

Remember, *it is impossible to do everything at once.* What is the single biggest stressor on your plate today? Let's break it down into tiny, bite-sized steps.`;
  }

  // 4. INSOMNIA & SLEEP DIFFICULTY
  if (
    query.includes("sleep") || 
    query.includes("insomnia") || 
    query.includes("nightmare") || 
    query.includes("awake") || 
    query.includes("night") || 
    query.includes("bed") ||
    query.includes("asleep")
  ) {
    return `### Settle Your Mind for Deep, Peaceful Rest 🌙

Lying awake in the dark can trap you in a frustrating cycle: the more you worry about not sleeping, the more active your mind becomes. Let's work on decelerating your thoughts.

#### 🧠 Try the "Cognitive Shuffle" Exercise (A natural brain-quieter)
This is an easy technique used by sleep psychologists to mimic the slow-wave thinking before sleep:
1. Think of a pleasant, neutral word (e.g., **"PEACE"**).
2. For each letter, list multiple words that start with it in your head (P: Pearl, Piano, Penguin, Pond...). Keep listing until you feel tired, then move to E.
3. This occupies your brain's language centers with random, non-threatening items, signaling to your brain that it is safe to tumble into sleep.

#### 💡 Simple Sleep Reminders:
*   **The Brain Dump:** Keep a physical notebook near your bed. If tomorrow's anxieties crop up, write them down so the notebook "holds" them for you until the sun rises.
*   **Remove Clock Watching:** Turn your phone and clocks face-down. Knowing exactly what hour it is only fuels bedtime worry.

Are you in bed right now, or preparing for sleep? Let me know, and we can go through a progressive muscle relaxation checklist together.`;
  }

  // 5. ANGER & IRRITATION
  if (
    query.includes("angr") || 
    query.includes("mad") || 
    query.includes("frustrat") || 
    query.includes("hate") || 
    query.includes("annoy") || 
    query.includes("irritat") ||
    query.includes("piss")
  ) {
    return `### Navigating High-Energy Frustration Safely 🌋

Anger and intense irritation are highly energetic emotional responses. They are completely valid! Most of the time, anger is a defensive "secondary emotion" designed to safeguard vulnerable core feelings underneath—such as hurt, shame, deep disappointment, or having your boundaries crossed.

Let's gently process this somatic energy safely:
*   **Somatic Release:** Clench your fists as hard as you can for 5 seconds, feeling the muscle tension, then release them fully. Feel the warm sensation of release. Repeat three times.
*   **The Ten-Minute Cooler:** If you are about to send a message or speak in heat, grant yourself permission to take a 10-minute walk before taking action.
*   **Looking Underneath:** Ask yourself quietly: *"What boundary of mine was crossed? What soft feeling is this anger trying to protect?"*

This is a totally safe, private space to vent and offload without judgment. What or who has triggered this frustration for you? Share it all; I'm here to listen.`;
  }

  // 6. RELATIONSHIPS & SOCIAL static
  if (
    query.includes("friend") || 
    query.includes("family") || 
    query.includes("partner") || 
    query.includes("spouse") || 
    query.includes("parent") || 
    query.includes("relationship") || 
    query.includes("breakup") || 
    query.includes("fight") || 
    query.includes("argument") ||
    query.includes("lonely")
  ) {
    return `### Nurturing Relationships & Upholding Boundaries 🤝

Interpersonal connections are the foundations of our emotional life, which is why interpersonal static, conflict, or loneliness can hurt so deeply. 

When you are navigating relationship worries or difficult boundaries, try these communication anchors:
*   **Shift to "I-Statements":** Instead of saying *"You always ignore my needs,"* try *"I feel disconnected and anxious when we go several days without a reassuring chat."* This prevents immediate defensive reflexes.
*   **The Emotional Pause:** If a discussion starts to spiral, say: *"I care about resolving this with you, but I need 15 minutes of cool-down time so I can listen properly."*
*   **Clarifying Boundaries:** Clear boundaries are a way of saying *"Here is how to love and respect me safely, so we can stay connected."* They are acts of connection, not division.

Is this situation connected to a friend, family member, or a partner? Tell me what has been taking place, and we can look at it together from a calm perspective.`;
  }

  // 7. GRATITUDE, APPRECIATION & VALUE
  if (
    query.includes("thank") || 
    query.includes("great") || 
    query.includes("good") || 
    query.includes("appreciate") || 
    query.includes("awesome") || 
    query.includes("helpful") || 
    query.includes("cool") ||
    query.includes("nice")
  ) {
    return `### I'm So Glad! ✨

You are very welcome! Taking active moments to check in with your emotional baseline, evaluate your feelings, and practice mindfulness is an incredibly powerful action of self-care. 

Honoring your emotional pace is a continuous process. You are doing a wonderful job simply by showing up, being curious about your inner landscape, and taking things one day at a time.

I will always be right here in our calm space whenever you need an empathetic listener. Would you like to explore anything else today, or perhaps step through a 2-minute breathing guide?`;
  }

  // 8. CRUCIAL COGNITIVE REFRAMING / SELF-CRITICISM
  if (
    query.includes("fail") || 
    query.includes("loser") || 
    query.includes("stupid") || 
    query.includes("dumb") || 
    query.includes("ugly") || 
    query.includes("useless") || 
    query.includes("never") || 
    query.includes("always") || 
    query.includes("regret") ||
    query.includes("hate myself")
  ) {
    return `### Gently Reframing Absolute Critical Thoughts 🧠

It sounds like your inner-critic is being incredibly loud and harsh with you right now. When we are exhausted or under pressure, our subconscious mind often generates severe, absolute stories like *"I'm a failure"* or *"I'll never get this right."* In Cognitive Behavioral Therapy (CBT), we call these **cognitive distortions** (such as *Black-and-White Thinking* and *Labeling*).

Let's gently pressure-test and re-evaluate this inner critic:
1. 🔍 **Is this thought 100% objective fact?** (Can a court of law prove this label to be true without a shadow of a doubt? Usually, it's just a harsh feeling rather than a factual definition).
2. 🔄 **Are there counter-examples?** (Have there been days where you survived challenges, demonstrated resilience, or did something helpful?)
3. ❤️ **What is a kinder, more balanced reality?** (Instead of *"I'm useless,"* trying: *"I'm human, I made a mistake, but I'm learning, and my value is not defined by single outcomes."*)

What are the specific statements your critic is repeating? Let's write them down here and gently untangle them piece by piece.`;
  }

  // 9. THERAPIST / WHAT CAN YOU DO / INTRO / GREETING
  const greetingWords = [
    "hello", "hi", "hey", "yo", "hlo", "hlw", "greeting", "namaste", "sup", "how are you", 
    "how are u", "how r u", "how's it going", "hows it going", "good morning", "good afternoon", 
    "good evening", "good day", "helo", "heloo", "hii", "helloo"
  ];
  const isGreeting = greetingWords.some(word => {
    if (word === "hi" || word === "yo" || word === "sup" || word === "hlo" || word === "hlw") {
      return query === word || 
             query.startsWith(word + " ") || 
             query.endsWith(" " + word) || 
             query.includes(" " + word + " ") || 
             query.includes(word + "!") || 
             query.includes(word + ",") || 
             query.includes(word + ".");
    }
    return query.includes(word);
  });

  const wordsCount = query.split(/\s+/).filter(Boolean).length;

  if (isGreeting) {
    const greetings = [
      "### Hello there! 👋 Welcome to MindEase AI.",
      "### Hi! It is wonderful to connect with you. 🌱",
      "### Welcome back to our calm space! ✨",
      "### Greetings! I am here and ready to support you. 🍃"
    ];
    const greetingAnswer = greetings[Math.floor(Math.random() * greetings.length)];
    return `${greetingAnswer}\n\nHow is your emotional climate or stress level today? Tell me what is on your mind, whether you'd like to vent, learn simple coping exercises, or explore dynamic mindfulness practices. I am ready to follow your lead.`;
  }

  // 10. AI SPECIFIC & PERSONAL QUESTIONS
  if (
    query.includes("who are you") || 
    query.includes("what are you") || 
    query.includes("your name") || 
    query.includes("are you a human") ||
    query.includes("are you a therapist") ||
    query.includes("what you do") ||
    query.includes("features") || 
    query.includes("capabilities")
  ) {
    return `### About MindEase AI 🤖✨

I am **MindEase AI**, your supportive counseling and mindfulness assistant. I have been created to walk alongside you as an empathetic listener, and to suggest evidence-based tools (like CBT exercises, reframing, and somatic breathing) for routine stress management and emotional comfort.

While I am not a clinical psychotherapist or a replacement for medical emergency care, I am always a safe, non-judgmental harbor for your thoughts. How might I assist you today?`;
  }

  // 11. PSYCHOLOGY, COGNITIVE REFRAMING & CBT QUESTIONS
  if (
    query.includes("cbt") || 
    query.includes("cognitive") || 
    query.includes("behavio") || 
    query.includes("distortion") || 
    query.includes("reframe") ||
    query.includes("thinking pattern")
  ) {
    return `### Understanding Cognitive Behavioral Therapy (CBT) 🧠

Cognitive Behavioral Therapy (CBT) is an incredibly powerful, evidence-based modality built on a simple insight: **our thoughts, feelings, physical sensations, and actions are deeply interconnected.**

Often, during times of stress, our minds naturally latch onto automatic negative thoughts (or "cognitive distortions" like *All-or-Nothing Thinking* or *Catastrophizing*). 

By learning to:
1.  🎯 **Identify** these automatic thoughts as they arise.
2.  🔍 **Examine** them objectively (Is this 100% objective fact, or just a harsh feeling?).
3.  🔄 **Reframe** them to a kinder, more realistic perspective.

We can gradually shift our emotional state and make healthier choices. Would you like to practice reframing a challenging thought you had recently?`;
  }

  // 12. GENERAL MENTAL HEALTH & WELLNESS QUESTIONS
  if (
    query.includes("mental health") || 
    query.includes("well-being") || 
    query.includes("wellness") ||
    query.includes("feel better") ||
    query.includes("happier")
  ) {
    return `### Nurturing Your Mental Well-being 🌸

Mental health is not simply the absence of stress or difficult days. It is the capacity to navigate life's inevitable waves with emotional resilience, self-compassion, and self-awareness.

True mental well-being includes:
*   ❤️ **Self-Compassion:** Embracing yourself as raw and imperfectly human.
*   🍃 **Mindful Presence:** Responding to heavy situations with space, rather than immediate reactivity.
*   🏃‍♂️ **Physical-Mental Harmony:** Caring for your sleep, physical movement, and hydration.

Resting, taking timeouts, and using positive coping mechanisms is an admirable act of strength. What is one small, simple thing you can do for yourself today to feel supported?`;
  }

  // 13. JOKES, LAUGHTER & DISTRACTIONS
  if (
    query.includes("joke") || 
    query.includes("laugh") || 
    query.includes("funny") || 
    query.includes("smile") ||
    query.includes("distract")
  ) {
    return `### A Warm Smile For You! 😊✨

Here is a lighthearted thought: 
*"I told my physical therapist that I broke my arm in two places. They told me to stop going to those places!"*

Sometimes, granting yourself permission to take a soft mental detour or share a simple laugh is exactly what your nervous system needs to de-escalate stress. What is a hobby, lighthearted movie, or favorite comfortable activity that usually makes you smile?`;
  }

  // 14. QUOTES, WISDOM & INSPIRATION
  if (
    query.includes("quote") || 
    query.includes("inspiration") || 
    query.includes("inspire") || 
    query.includes("motivation") ||
    query.includes("wisdom")
  ) {
    const quotes = [
      "\"You don't have to control your thoughts; you just have to stop letting them control you.\" — Dan Millman",
      "\"The greatest weapon against stress is our ability to choose one thought over another.\" — William James",
      "\"Even the darkest night will end and the sun will rise.\" — Victor Hugo",
      "\"Breathe in deeply to bring your mind home to your body.\" — Thich Nhat Hanh"
    ];
    const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return `### A Quote of Comfort & Reassurance 📜✨

> ${selectedQuote}

Take a deep breath and let those words gently wash over you. Remember, you do not have to carry everything all at once. Try to release any muscle tension in your shoulders or neck right now. I am here if you want to share what is on your heart.`;
  }

  // 15. HOW ARE YOU / GENERAL CHITCHAT
  if (
    query.includes("how are you") || 
    query.includes("how are u") || 
    query.includes("how r u") || 
    query.includes("how is it going") || 
    query.includes("hows it going") || 
    query.includes("how you doing") ||
    query === "hows going" ||
    query === "hows everything"
  ) {
    return `### I'm Doing Great, Thank You for Asking! 🌟

I am here, active, peaceful, and fully ready to hold this calm space for your emotional support and well-being. 

How are *you* doing at this exact second? Let me know what concerns are on your shoulders or if you'd simply like some guidance on maintaining stable emotional flow.`;
  }

  // 16. SMART DYNAMIC CONVERSATIONAL FALLBACK (VARIED SCHEMAS SO IT NEVER FEELS REPETITIVE)
  if (wordsCount <= 2) {
    const briefReplies = [
      `### I'm Right Here With You 🍃\n\nI appreciate your response. Whenever you feel comfortable, feel free to elaborate or let me know if there's a particular concern you'd like us to focus on.`,
      `### Take Your Time 🌟\n\nI hear you. There is no rush at all in our calm space. What thought, somatic feeling, or question would you like to direct our talk towards?`,
      `### Gentle Connection ✨\n\nUnderstood. I am holding this peaceful space for you. Feel free to use this moment to vent, ask any question about mental well-being, or let me know if we should try a short, soothing breathing exercise.`
    ];
    return briefReplies[Math.floor(Math.random() * briefReplies.length)];
  }

  // For multi-word unmatched entries, pull from highly reflective Rogers templates dynamically
  const reflections = [
    `### Reflecting on This Together 🍃

Thank you for opening up to me. It sounds like you are carrying some deep reflections around **${mirrorPhrase || "your current situation"}**. 

In counseling and client-led mindfulness, we view every challenge as an invitation to check in with our inner self. To help us gently unpack this:
*   What particular memories or thoughts are staying active as you think about this?
*   Do you notice any stress-holding areas in your physical body (like shallow chest breathing, or tightness in your stomach/shoulders)?

Go gently, at your own pace. I am completely here to listen.`,

    `### Unpacking and Caring 💙

I hear you clearly, and I am grateful you are giving voice to these thoughts regarding **${mirrorPhrase || "what is happening"}**. Letting these words flow is often the first step in unlocking emotional relief.

Let us pause for a second. Try dropping your jaw and letting your shoulders slide down. 
*   If we were to look underneath this feeling, what do you think is the primary need trying to express itself?
*   Would you like us to explore a simple reframing practice, or do you just need a compassionate, secure ear to hear you out?`,

    `### Gentle Awareness of Your Words 🌟

It makes complete sense that you are focusing on **${mirrorPhrase || "your current thoughts"}**. These details deserve safe, non-judgmental recognition.

To help you anchor your mind right now:
*   What is one compassionate, kind thing you could tell yourself regarding this matter?
*   I am here to explore this with you completely. How can I best support you in navigating these emotions next?`
  ];

  return reflections[Math.floor(Math.random() * reflections.length)];
}

// Global caching for Google Gen AI client so we don't recreate it on every request
let aiClientInstance: any = null;

function getGeminiClient() {
  if (!aiClientInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && !key.startsWith("YOUR_") && !key.startsWith("MY_")) {
      try {
        aiClientInstance = new GoogleGenAI({ apiKey: key });
      } catch (err) {
        console.error("Failed to initialize GoogleGenAI client:", err);
      }
    }
  }
  return aiClientInstance;
}

export async function getChatResponse(prompt: string, history: { role: string; parts: { text: string }[] }[] = []) {
  // 1. Try to fetch from server-side secure /api/chat first (keeps API keys protected)
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, history }),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.text) {
        return data.text;
      }
    }
  } catch (serverError) {
    console.warn("Express /api/chat endpoint not reachable, attempting direct browser client connection...", serverError);
  }

  // 2. Client-side direct browser connection fallback (if server is unreachable/offline)
  try {
    const client = getGeminiClient();
    if (client) {
      // Map history to the structured format expected by Gemini API
      const contents = history.map(h => ({
        role: h.role === "model" ? "model" as const : "user" as const,
        parts: [{ text: h.parts?.[0]?.text || "" }]
      }));
      
      // Add latest prompt
      contents.push({
        role: "user" as const,
        parts: [{ text: prompt }]
      });

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: "You are MindEase AI, an empathetic, secure, and compassionate counseling assistant. You prioritize context-aware, highly relevant, and deeply personalized responses tailored specifically to the user's current dialogue. Do not repeat rigid pre-defined scripts or generic templates. Speak directly to the details shared by the user. Use a warm, professional, therapeutic, and active-listening human tone. Provide helpful coping mechanisms, CBT cognitive reframing, or mindfulness advice when appropriate. Always keep responses relatively concise, easy to read, and formatted with clean Markdown. Never provide formal clinical diagnoses.",
        }
      });

      if (response && response.text) {
        return response.text;
      }
    }
  } catch (error) {
    console.warn("Real-time Gemini browser API failed or is unauthorized, using healthy local fallback engine:", error);
  }

  // 3. Fallback to smart local reflection/CBT engine
  return getLocalFallbackResponse(prompt, history);
}

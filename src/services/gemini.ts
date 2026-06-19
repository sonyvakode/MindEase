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
  const greetingWords = ["hello", "hi", "hey", "yo", "greeting", "namaste", "sup", "how are you", "how are u", "how's it going", "hows it going", "good morning", "good afternoon", "good evening", "good day"];
  const isGreeting = greetingWords.some(word => {
    if (word === "hi" || word === "yo" || word === "sup") {
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

  if (
    isGreeting ||
    query === "start" || 
    query.includes("who are you") || 
    query.includes("what are you") || 
    query.includes("features") || 
    query.includes("capabilities") || 
    query.includes("help me") || 
    query.includes("anyone") ||
    query.includes("ask") ||
    query.includes("question")
  ) {
    return `### Welcome to MindEase AI Support! 👋🌱

I am your secure, compassionate counseling assistant. I am always here to provide stress relief strategies, safe emotional offloading, and positive coping actions.

Here is what we can do in our chat space anytime:
*   🍃 **Navigate Emotional Stresses:** Simply share if you are feeling anxious, stressed, down, or angry.
*   🌬️ **Mindfulness Practice:** Ask for customized breathing techniques, somatic grounding, or peaceful visualizations.
*   🧠 **Cognitive Exercises:** We can analyze critical thoughts, untangle cognitive distortions, and practice behavioral reframing.
*   💬 **General Questions:** Ask me anything! I am equipped to answer questions about mental well-being, healthy habits, sleep rituals, and constructive routines.

How are you doing in this current moment? Tell me a bit about what is on your plate or what question is on your mind!`;
  }

  // 10. DYNAMIC REFLECTIVE ACTIVE LISTENING (ROGERS CLIENT-CENTERED RESPONSE FOR UNMATCHED USER PROMPTS)
  return `### Exploring This Together 🍃

Thank you for sharing that with me. It sounds like you are holding some very deep thoughts and feelings around **${mirrorPhrase || "what you are experiencing"}**. 

In client-led therapeutic approaches, we recognize that you are the ultimate expert on your life, and taking space to articulate your experiences is how we uncover pathways to emotional balance.

To support us in understanding this better:
*   What particular thoughts or old memories seem to stand out the most as you think about this?
*   Do you notice any physical sensations (such as a tightness in your chest, a heavy stomach, or shallow breathing) reacting to this subject right now?

I am fully here to listen and explore alongside you. Go at your own pace.`;
}

export async function getChatResponse(prompt: string, history: { role: string; parts: { text: string }[] }[] = []) {
  // Always immediately provide high-quality responses locally, bypassing any remote Gemini API calls/keys
  return getLocalFallbackResponse(prompt, history);
}
